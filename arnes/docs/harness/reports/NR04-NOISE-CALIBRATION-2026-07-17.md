# NR-04 - Noise calibration and beta CLI

Date: 2026-07-17

Functional verdict: `PASS_CONTROLLED`

Construction verdict: `BLOCKED_NR02_HOST`

Process conformance: `PARTIAL` because a red-before-green artifact from before implementation was not preserved. This is recorded explicitly and is not converted into a PASS.

## Implemented controls

- `native init`: creates an isolated pilot scaffold and labels it `SCAFFOLD_ONLY`.
- `native doctor`: distinguishes scaffold readiness from construction readiness.
- `native lint`: validates a provider-agnostic brief and Render Contract.
- `native calibrate`: runs repeated captures in fresh browser contexts.
- `native freeze`: refuses to freeze without contract, calibration, and forensic evidence.
- `native verify`: requires every construction prerequisite to pass.
- NR-04 analyzer measures pixel, geometry, typography, timing, scroll, network, font, and active-animation variance.
- Every tolerance records the observed distribution, safety rule, justification, and owner.
- Existing frozen calibration artifacts cannot be overwritten by a new run.

## Controlled evidence

Evidence root:

```text
C:\Desarrollo\pruebas-arnes\nr04-controlled-20260717
```

Matrix:

- 60 samples.
- 12 cells.
- Viewports: `390x700`, `768x700`, `1440x700`.
- States: `initial`, `hover`, `scroll-slow`, `scroll-fast`.
- Repetitions: 5 per cell.
- Owner: `browser-auditor`.
- Analysis SHA-256: `6e01ab93b0f6de784445846a5f75467d601416cdd15e73a73a693c0319e4c44b`.
- Matrix file SHA-256: `0a738b8cb391b0d5a4b9a3afe69ffd6eacb9f4fc71aebad0cdd1de495b1640d9`.
- Runs file SHA-256: `f9d48b742d7c892d8b36349f0ca1cfdd4bf220a9ac38815f27e5ca118d61a73b`.
- Frozen hashes: verified against both files.

## Verification

```text
npm.cmd test      -> PASS, 79/79
npm.cmd run eval  -> PASS, EVAL GOLDEN: OK
expanded NR-04    -> PASS, 3/3 tests and 60 browser captures
```

The main CLI was also run against `native-reconstruction-v2-pilot-001`:

- `doctor --level=scaffold`: PASS.
- status: `SCAFFOLD_ONLY`.
- `doctor --level=construct`: expected FAIL/BLOCKED.
- NR-04 in that pilot: PENDING until its own target is calibrated.
- NR-02: BLOCKED because this machine has neither Docker nor WSL and the local Node permission model does not deny network.

## Boundary

This result certifies the calibration mechanism on a controlled reference. It does not certify fidelity, purity, or construction readiness for a client target. Each real pilot must produce and freeze its own matrix, forensic evidence, contract, host evidence, and independent audit.
