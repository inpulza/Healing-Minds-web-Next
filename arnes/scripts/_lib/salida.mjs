// # READ: librería interna. Los scripts la importan; no se ejecuta directamente.
export function leerArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (const a of argv) {
    if (a.startsWith('--')) {
      const [k, ...v] = a.slice(2).split('=');
      args[k] = v.length ? v.join('=') : true;
    } else args._.push(a);
  }
  return args;
}

export function pass(msg) { console.log(`PASS ${msg}`); }

export function fail(msg, arreglo) {
  console.error(`FAIL ${msg}`);
  if (arreglo) console.error(`  → Arreglo: ${arreglo}`);
}
