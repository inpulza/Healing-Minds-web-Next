# Auditoría: insurance-plans — intento 2

- Fecha: 2026-08-26T17:09:30.7693961+02:00 · Auditor: Codex, auditor independiente · Viewports: 390x844, 768x1024, 1024x900, 1440x900, 1920x1080, 3440x1440 · Umbral de solapamiento: 1 px

## Veredicto

REAUDIT_PASS

## Evidencia de diffs visuales

Esta restauración se verificó mediante contrato visual y geométrico contra el build final; no se generó un porcentaje de diff pixel a pixel y no se inventa uno. La matriz final se produjo después del `BUILD_ID` verificado y cubre Home, Contact y una location representativa en inglés y español.

| viewport | resultado | veredicto | archivo |
|----------|-----------|-----------|---------|
| 390x844 | 6/6 rutas, planCount 14, logos cargados, sin overflow ni prohibidos | PASS | `C:\Users\jorda\Documents\Codex\2026-08-26\hm-web-03-restore-insurance-section\outputs\local-insurance-visual\results.json` |
| 768x1024 | 6/6 rutas, planCount 14, logos cargados, sin overflow ni prohibidos | PASS | `C:\Users\jorda\Documents\Codex\2026-08-26\hm-web-03-restore-insurance-section\outputs\local-insurance-visual\results.json` |
| 1024x900 | 6/6 rutas, planCount 14, logos cargados, sin overflow ni prohibidos | PASS | `C:\Users\jorda\Documents\Codex\2026-08-26\hm-web-03-restore-insurance-section\outputs\local-insurance-visual\results.json` |
| 1440x900 | 6/6 rutas, planCount 14, logos cargados, sin overflow ni prohibidos | PASS | `C:\Users\jorda\Documents\Codex\2026-08-26\hm-web-03-restore-insurance-section\outputs\local-insurance-visual\results.json` |
| 1920x1080 | 6/6 rutas, planCount 14, logos cargados, sin overflow ni prohibidos | PASS | `C:\Users\jorda\Documents\Codex\2026-08-26\hm-web-03-restore-insurance-section\outputs\local-insurance-visual\results.json` |
| 3440x1440 | 6/6 rutas, planCount 14, logos cargados, sin overflow ni prohibidos | PASS | `C:\Users\jorda\Documents\Codex\2026-08-26\hm-web-03-restore-insurance-section\outputs\local-insurance-visual\results.json` |

Evidencia reproducida por el auditor:

- `npm test`: 186/186 PASS (175 pruebas MJS y 11 TypeScript).
- Contratos focales de seguros/assets reproducidos por el auditor: 14/14 PASS.
- TypeScript: PASS.
- Build Next: 87/87 páginas PASS; budgets `/` 669.1/750 KiB y `/[...slug]` 780.2/850 KiB.
- Playwright focal final: 7 PASS y 1 skip deliberado. El caso omitido en el perfil móvil ejecuta una sola vez, desde el perfil desktop, la matriz geométrica de 18 combinaciones: seis rutas EN/ES por 390, 768 y 1440 px.
- Playwright completo: 153 PASS, 25 skips deliberados y 0 fallos.
- Reauditoría focal de movimiento reducido reproducida por el auditor: 2/2 PASS, un perfil Desktop Chrome y un perfil móvil. Cada perfil verificó una cuadrícula estática con los catorce elementos, imágenes visibles y `naturalWidth > 0`, sin botón de pausa ni animación.
- Matriz visual final: 36/36 capturas PASS, cero errores, cero overflow, cero nombres/requests prohibidos, `data-plan-count="14"` en todas las rutas y solapamiento máximo del header de 0.5 px frente al gate de 1 px.
- Búsqueda final en `.next/static` y `.next/server`: cero coincidencias para Florida Blue, Blue Cross, BCBS, `insurance-florida-blue` y `6_1755868276798`; tampoco existen filenames públicos coincidentes.
- Lista canónica exacta: Aetna, United Healthcare, Medicare, Medicaid, Cigna, Ambetter, First Health, Oscar, WellCare, Sunshine Health, AvMed, Doctors Healthcare Plans, CHAMPVA y Florida Medicaid.

## Correcciones ordenadas

Las correcciones del Code Review quedaron verificadas en el intento 2:

1. [interaccion] Con `prefers-reduced-motion: reduce`, los catorce planes se renderizan como lista visual estática accesible y dejan de depender de una rotación automática.
2. [navegacion] Las consultas SSR del E2E desplegado aplican la credencial de Preview limitada al origen.
3. [otro] `APROBADO_SPECS: no` conserva sin inferencia el estado global de las otras once secciones; la aprobación y verificación de `insurance-plans` permanecen acotadas en su spec, decisiones, fila `✅` y este informe.

## Línea de telemetría

El intento inicial y esta reauditoría están registrados como dos líneas válidas en `_arnes/verify/ciclos.jsonl`.

## Riesgos / notas para el humano

- Ninguno pendiente para esta sección.
- El archivo histórico `_arnes/captura/assets/07-6_1755868276798-br_DyTaZ.webp` es evidencia congelada, está excluido por `.vercelignore` y no es un asset público ni una request de producción.
- Los errores `ECONNREFUSED` y `ChunkLoadError` observados en corridas intermedias ocurrieron durante builds concurrentes; fueron sustituidos por la corrida focal estable final indicada arriba.
