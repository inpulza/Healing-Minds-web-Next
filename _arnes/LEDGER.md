# LEDGER — registro de secciones

APROBADO_SPECS: no
<!-- El humano cambia "no" por "sí" tras revisar los specs (checkpoint fase 2→3). -->

Estados: ⬜ pendiente | 🔧 en construcción | 🔎 en verificación | ✅ verificada (solo el auditor) | ⛔ bloqueada (decide humano)
Rutas: `spec` relativa a `_arnes/`; `codigo` relativa a la raíz del proyecto.
IDs: solo minúsculas, números y guiones (`hero`, `faq-top`). Mayúsculas o `_` hacen que la fila NO se lea.
Toda fila necesita sus 7 barras `|` (una al final también) o NO se lee.

| id | seccion | estado | spec | codigo | evidencia |
|----|---------|--------|------|--------|-----------|
| hero | Hero principal | 🔎 | spec/hero.md | client/src/components/Hero.tsx | evidencia/visual/PRIORITY-AUDIT.md |
| insurance-plans | Planes de seguro | 🔎 | spec/insurance-plans.md | client/src/components/InsuranceLogos.tsx | evidencia/asset-audit.json |
| telehealth-services | Servicios de telehealth | 🔎 | spec/telehealth-services.md | client/src/components/TelehealthSection.tsx | evidencia/visual/PRIORITY-AUDIT.md |
| doctor-profile | Presentación profesional | 🔎 | spec/doctor-profile.md | client/src/components/DoctorSection.tsx | evidencia/visual/PRIORITY-AUDIT.md |
| mental-health-services | Servicios de salud mental | 🔎 | spec/mental-health-services.md | client/src/components/Services.tsx | evidencia/content-parity.json |
| bilingual-care | Cuidado bilingüe | 🔎 | spec/bilingual-care.md | client/src/components/BilingualCare.tsx | evidencia/visual/PRIORITY-AUDIT.md |
| service-areas | Áreas de servicio | 🔎 | spec/service-areas.md | client/src/components/ServiceAreas.tsx | evidencia/visual/PRIORITY-AUDIT.md |
| primary-cta | CTA principal | 🔎 | spec/primary-cta.md | client/src/components/CTASection.tsx | evidencia/content-parity.json |
| patient-reviews | Reseñas de pacientes | 🔎 | spec/patient-reviews.md | client/src/components/Reviews.tsx | evidencia/visual/PRIORITY-AUDIT.md |
| patient-resources | Información para pacientes | 🔎 | spec/patient-resources.md | client/src/components/ForPatients.tsx | evidencia/content-parity.json |
| faq | Preguntas frecuentes | 🔎 | spec/faq.md | client/src/components/FAQ.tsx | evidencia/content-parity.json |
| contact | Contacto y mapa | 🔎 | spec/contact.md | client/src/components/Contact.tsx | evidencia/visual/PRIORITY-AUDIT.md |
