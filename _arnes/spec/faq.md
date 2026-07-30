# Spec retrospectivo: Preguntas frecuentes

Fuente de verdad: `_arnes/captura/secciones.json`, las capturas congeladas de `_arnes/captura/`, `_arnes/spec/design-tokens.json` y el informe `_arnes/evidencia/visual/PRIORITY-AUDIT.md`.

Este documento regulariza el contrato medido después de que la implementación Next.js ya existiera. No implica aprobación humana, `AUDIT_PASS` ni que la construcción histórica siguiera Fase 3.

## Identidad

- id: `faq`.
- Selector original registrado: `main > div:nth-child(11)`.
- Rol: preguntas frecuentes.
- Modo: `clon`.
- Código mapeado: `client/src/components/FAQ.tsx` mediante `client/src/pages/Home.tsx`.

## Geometría

- Altura fuente registrada a 1440 px: **1096 px**.
- Capturas fuente congeladas disponibles a 390, 768 y 1440 CSS px.
- La medición DOM interna por elemento y los raws específicos 1024/1920/2560 no forman parte del expediente histórico; deben producirse en la auditoría externa y no se estiman aquí.
- La comparación ampliada usa 390x844, 768x1024, 1024x900, 1440x900, 1920x1080 y 2560x1440.

## Tipografía y color

- Familias globales medidas: Instrument Sans y Playfair Display.
- Colores, tamaños, espaciados y radios: `_arnes/spec/design-tokens.json`.
- Los valores específicos por nodo quedan pendientes del raw DOM de la auditoría externa; no se infieren desde la captura.

## Contenido

- Copy fuente completo: `_arnes/captura/texto.txt` y `shared/site-snapshot.json`.
- Assets congelados: `_arnes/captura/assets/manifest.json`.
- Auditorías de soporte: `_arnes/evidencia/content-parity.json`, `_arnes/evidencia/seo-parity.json` y `_arnes/evidencia/asset-audit.json`.
- El copy no se reescribe ni se reemplaza por contenido inventado.

## Interacciones y animación

- El estado comparable se captura tras recorrer el scroll, volver al inicio y esperar settlement.
- Hover, focus, active, reveal, sticky, carruseles, mapas o acordeones deben verificarse cuando existan en este bloque.
- Está prohibido fijar estados transitorios mediante opacity, transform o manipulación del DOM.
- La evidencia detallada de interacción, scroll physics, seams y trace queda pendiente del trial externo.

## Responsive

- Viewports obligatorios: 390x844, 768x1024, 1024x900, 1440x900, 1920x1080 y 2560x1440.
- Debe comprobarse geometría interna, overflow navegable, contenido condicional y estado settled en los seis.
- Los fallos de lazy media de la fuente se clasifican con evidencia HTTP/geométrica; no se oculta contenido funcional del candidato para reducir el diff.

## Fuera de alcance

- Configurar Resend o cambiar DNS.
- Declarar la sección `✅` desde la sesión constructora.
- Sustituir raws, graders, `aggregate.json` o informe firmado por resúmenes page-level.
