# La fila del LEDGER de `hero`, estado por estado

La misma fila de `_arnes/LEDGER.md` avanza sola a lo largo del pipeline. El estado NO lo pones tú
a gusto: lo mueve la fase (⬜→🔧 el constructor, 🔧→🔎 al emitir señal QA, 🔎→✅ SOLO el auditor).

```
| id   | seccion        | estado | spec         | codigo    | evidencia                       |
|------|----------------|--------|--------------|-----------|---------------------------------|
| hero | Hero principal | ⬜     | spec/hero.md | -         | -                               |   ← fase 02: inventariada, spec por aprobar
| hero | Hero principal | 🔧     | spec/hero.md | hero.html | -                               |   ← fase 03: en construcción (spec ya APROBADO)
| hero | Hero principal | 🔎     | spec/hero.md | hero.html | señal QA emitida                |   ← fase 03→04: handoff al auditor
| hero | Hero principal | ✅     | spec/hero.md | hero.html | verify/hero-audit.md · diff 0%  |   ← fase 04: AUDIT_PASS, el auditor la cierra
```

Recordatorio del formato: id en minúsculas/números/guiones, y las **7 barras `|`** (incluida la del
final) o la fila NO se parsea. El constructor jamás escribe ✅ (Regla dura 4).
