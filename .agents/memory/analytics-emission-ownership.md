---
name: Analytics & pixel emission ownership
description: Who is allowed to emit a page view (GA4, TikTok, Clarity) and why per-instance refs or emitting before gtag config silently duplicate or lose events.
---

# Quién emite las vistas de página

Regla: **la emisión de una vista de página tiene un único dueño por navegación, controlado con estado a nivel de módulo; las banderas por instancia (`useRef`) no sirven para eso.**

**Why:** varios componentes montan el mismo hook a la vez (App.tsx, Footer y páginas concretas montan su propia instancia). Con un ref por instancia hay dos fallos simétricos, y arreglar uno provoca el otro:

- gatear los **métodos devueltos** (`track`, `identify`) con el ref por instancia → las instancias que no inicializaron el píxel descartan silenciosamente sus eventos;
- gatear la **vista de página** con banderas globales → cada instancia montada emite su propia vista en cada navegación e infla las métricas de campaña.

La combinación correcta es asimétrica: métodos devueltos gateados por banderas globales de módulo (cualquiera puede emitir un evento propio), y vista de página deduplicada a nivel de módulo (solo la primera instancia que reacciona a la navegación emite).

**La clave de deduplicación no puede ser solo la ruta.** Revocar y volver a conceder el consentimiento en la MISMA ruta tiene que contar otra vista (el efecto de ruta no se vuelve a ejecutar porque la ruta no cambió), y a la vez emitir una sola aunque haya N instancias escuchando el evento de consentimiento. Dos trampas concretas:

- **No reiniciar la clave dentro del listener de consentimiento.** Cada instancia montada registra su propio listener y todos corren para el mismo evento: si cada uno pone la clave a `null` antes de emitir, salen N vistas. La invalidación va donde ocurre **una sola vez** (en la revocación, ya protegida por la bandera global), por ejemplo incrementando un contador de "generación de consentimiento" que forma parte de la clave (`generación:ruta`).
- **El snippet de arranque del píxel emite su propia vista.** El bootstrap de TikTok llama a `ttq.page()` al cargar. Si no se marca esa ruta como ya rastreada, el efecto de ruta de esa instancia —y de cualquiera que se monte después en la misma página— emite una segunda vista de la página de entrada. Y la inicialización tiene **dos** finales (inyectar el snippet, o encontrar un píxel que otro script ya cargó): los dos han contado ya la ruta, así que el marcado va en una salida común; una rama que sale antes con `return` reabre el duplicado.

**Regla GA4 aparte:** un `gtag('event', ...)` emitido antes de que corra `gtag('config', ...)` entra en la cola de consent mode sin destino de medición y se pierde. Y como la configuración usa `send_page_view: false` a propósito (para no duplicar vistas), nadie lo reemite. Por eso la primera vista se retiene hasta que la configuración termina y se reemite entonces — y no se marca como "ya rastreada" mientras no exista destino, o el deduplicador la bloquea para siempre.

**How to apply:** al tocar `analytics.ts` o cualquier hook de píxel, preguntar (1) "¿cuántas instancias de este hook están montadas?" y (2) "¿existe ya el destino de medición cuando esto se ejecuta?". Si se cambia el gateado de refs por instancia a banderas globales, revisar la emisión de vistas de página **por separado**: es justo el caso donde "global" significa "duplicado".

## Los envíos diferidos rompen la atomicidad del claim

Reclamar la vista y enviarla no ocurren en el mismo instante: los píxeles aplazan el envío (idle callback / timeout) y el píxel lee la URL **en el momento del envío**. El claim tiene que devolver un token y el envío tiene que revalidarlo justo antes de disparar.

**Why:** entre el claim y el envío el visitante puede navegar (la vista se atribuiría a la ruta nueva, que ya reclama la suya) o revocar el consentimiento (se trackearía sin permiso).

**How to apply:** un token solo es válido si coincide con la clave registrada **y** con la generación de consentimiento vigente. Subir la generación no mueve la clave registrada hasta el siguiente claim, así que comparar solo contra la clave deja pasar tokens emitidos antes de una revocación — ese fue el fallo real, no la aritmética. Cubrir cada comprobación con un guard que falle al quitarla.

## Claim identity is not slot identity

A dedupe key answers "has this slot been claimed?"; it cannot answer "is THIS claim still the
current one". Any emitter that defers its send (idle callback, timeout) needs a claim token that
is unique per claim — a monotonic counter — because the visitor can return to a route (A -> B -> A)
and rebuild the identical key, at which point a key-based token makes an abandoned claim look
current again.

**Why:** with the sends deferred past all three navigations, both visits to A passed the freshness
check and emitted, while B's view was dropped: one route double-counted, another lost. Reasoning
about "the key moved on" is not enough, because the key can move back.

**How to apply:** hand out `seq:generation:location`, keep the newest token plus the generation it
was issued under, and compare a deferred claim against that token — never against the dedupe key.
Marking a view as already emitted elsewhere (bootstrap snippet) supersedes in-flight claims.
Guard it with a revisit scenario AND a shape assertion, since the arithmetic can pass by accident.
