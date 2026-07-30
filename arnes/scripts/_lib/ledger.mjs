// # READ: librería interna. Parsea _arnes/LEDGER.md.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ESTADOS = ['⬜', '🔧', '🔎', '✅', '⛔'];

export function parseLedger(dirArnes) {
  const texto = readFileSync(join(dirArnes, 'LEDGER.md'), 'utf8');
  const aprobado = /APROBADO_SPECS:\s*s[ií]/i.test(texto);
  const secciones = [];
  for (const linea of texto.split('\n')) {
    const m = linea.match(/^\|\s*([a-z0-9-]+)\s*\|([^|]*)\|\s*(⬜|🔧|🔎|✅|⛔)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|/u);
    if (m && m[1] !== 'id') {
      secciones.push({
        id: m[1], nombre: m[2].trim(), estado: m[3],
        spec: m[4].trim(), codigo: m[5].trim(), evidencia: m[6].trim(),
      });
    }
  }
  return { aprobado, secciones };
}
