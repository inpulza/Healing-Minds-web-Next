// # READ: librería interna. Carga y valida _arnes/config.json.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const OBLIGATORIOS = ['TARGET_URL', 'MODO', 'STACK', 'VIEWPORTS'];
const MODOS = ['clon', 'inspiracion'];

export function cargarConfig(dirArnes = '_arnes') {
  const ruta = join(dirArnes, 'config.json');
  let raw;
  try { raw = readFileSync(ruta, 'utf8'); }
  catch { throw new Error(`No existe ${ruta}. Corre: npx arnes-clonador-web init`); }
  let cfg;
  try { cfg = JSON.parse(raw); }
  catch (e) { throw new Error(`${ruta} no es JSON válido: ${e.message}`); }
  const faltan = OBLIGATORIOS.filter(c =>
    cfg[c] === undefined || cfg[c] === '' || (Array.isArray(cfg[c]) && cfg[c].length === 0));
  if (faltan.length)
    throw new Error(`Campos faltantes en ${ruta}: ${faltan.join(', ')}. Obligatorios: ${OBLIGATORIOS.join(', ')}`);
  if (!MODOS.includes(cfg.MODO))
    throw new Error(`MODO inválido "${cfg.MODO}". Valores permitidos: ${MODOS.join(' | ')}`);
  cfg.UMBRAL_DIFF ??= 3;
  cfg.SRC_DIR ??= 'src';
  cfg.BUILD_CMD ??= 'npm run build';
  cfg.REQUIRED_VIEWPORTS ??= ['390x844', '768x1024', '1024x900', '1440x900', '1920x1080', '2560x1440'];
  cfg.EVAL_SUITE_DIR ??= join(dirArnes, 'eval-suite');
  cfg.REQUIRE_TRACE ??= true;
  cfg.REQUIRE_CODE_GRADERS ??= true;
  cfg.REQUIRE_EXTERNAL_AUDITOR ??= true;
  cfg.ALLOW_MODEL_GRADER_TO_OVERRIDE_CODE_FAIL ??= false;
  return cfg;
}
