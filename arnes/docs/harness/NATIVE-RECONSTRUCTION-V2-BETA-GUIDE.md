# Native Reconstruction V2 - Beta guide

Canonical harness:

```text
C:\Desarrollo\Clonar web con arnes
```

Pilot example:

```text
C:\Desarrollo\pruebas-arnes\native-reconstruction-v2-pilot-001
```

## Available commands

```powershell
cd 'C:\Desarrollo\Clonar web con arnes'
node cli\cli.mjs native --help
```

The beta exposes `init`, `doctor`, `lint`, `calibrate`, `freeze`, and `verify`. These commands do not replace or modify the V1 workflow.

## Safe smoke test

Use a new disposable pilot path:

```powershell
$pilot = 'C:\Desarrollo\pruebas-arnes\my-native-v2-smoke'
node cli\cli.mjs native init --pilot-root="$pilot" --pilot-id=my-smoke --with-fixture
node cli\cli.mjs native doctor --pilot-root="$pilot" --level=scaffold
node cli\cli.mjs native doctor --pilot-root="$pilot" --level=construct
```

Expected results:

- `init`: PASS with status `SCAFFOLD_ONLY`.
- scaffold doctor: PASS.
- construction doctor: FAIL/BLOCKED. This is the correct result until calibration, frozen evidence, and external host isolation exist.

`--with-fixture` is only for testing the harness mechanics. It must not be used as the contract of a real target.

## Calibrate a target section

```powershell
node cli\cli.mjs native calibrate `
  --url=https://example.test/ `
  --selector="#section" `
  --section=section `
  --owner=auditor-name `
  --pilot-root="$pilot"
```

Defaults are three viewports (`390`, `768`, `1440`), four states (`initial`, `hover`, `scroll-slow`, `scroll-fast`) and five fresh browser contexts per cell. The command refuses fewer than five repetitions and refuses to overwrite a frozen calibration.

Then run:

```powershell
node cli\cli.mjs native doctor --pilot-root="$pilot" --level=scaffold
```

NR-04 should now be PASS for that exact target and selector. This does not authorize construction.

## Current boundary

The beta control plane and calibration engine are ready for manual testing. Native construction remains blocked on this PC because no eligible external host is installed. Docker is unavailable, WSL is not installed, and the local Node permission model cannot prove network denial. Do not self-attest this gate or run the Constructor with access to the original.
