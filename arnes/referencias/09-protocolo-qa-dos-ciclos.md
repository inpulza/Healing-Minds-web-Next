# Protocolo QA de dos ciclos (sin bucles infinitos)

**Síntoma:** llevas 3+ rondas de fix sobre la misma sección sin converger. QA emite otro "corrige otra vez", el constructor reintenta, y el proceso entra en bucle sin aprender.

**Regla:** cada página o corrección tiene MÁXIMO dos pasadas de QA: (1) auditoría inicial y (2) reauditoría tras aplicar el único handoff correctivo. Si la reauditoría falla, NO hay tercer intento automático: la sección queda bloqueada y decide un humano. El objetivo no es insistir hasta que salga: es detectar que si tras una corrección dirigida el clon sigue fallando, el problema ya no es la página sino el proceso, la memoria o la interpretación visual.

**Cómo detectarlo:** el tope de 2 ciclos ya está en las fases y el gate:
- Fase 03 (build): "máximo 2 ciclos; si el auditor falla el intento 2, la sección queda ⛔ y decide el humano".
- Fase 04 (verify): "el tercero no existe: ⛔ y humano".
- El gate de la fase 5 exige un caso de estudio para cada sección ⛔.

**Estados permitidos:** `READY_FOR_AUDIT`, `AUDIT_PASS`, `AUDIT_FIX_REQUIRED`, `READY_FOR_REAUDIT`, `REAUDIT_PASS`, `QA_BLOCKED_AFTER_REAUDIT`. **Prohibidos sin humano:** tercera auditoría, tercer handoff correctivo, reintentos indefinidos.

**Cómo arreglarlo (por qué el formato de señal importa):** el intercambio va por señales de texto estables, no por chat libre, para que cualquier sesión sepa en qué ciclo va sin releer todo:

```text
QA_SIGNAL: READY_FOR_AUDIT | READY_FOR_REAUDIT
Audit cycle id: <seccion>-<fecha>-<numero>
Attempt: 1 | 2
Cambios hechos: ...
Evidencia: ...
Riesgos conocidos: ...
```

Si QA devuelve `AUDIT_PASS`/`REAUDIT_PASS`, el constructor continúa con la siguiente sección pendiente. Si devuelve `AUDIT_FIX_REQUIRED` o `QA_BLOCKED_AFTER_REAUDIT`, se detiene.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
