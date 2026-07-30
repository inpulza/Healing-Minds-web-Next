# Arnes Estricto - Render Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the arnes web-clone workflow so a section cannot be approved unless it has been measured like a browser render: page context, section structure, CSS constraints, responsive behavior, interaction states, scroll physics, seams with adjacent sections, and independent auditor verification.

**Architecture:** The new arnes must produce a durable **Render Contract** for each section before construction. The constructor builds only from this contract. A separate auditor, in a clean session, compares original vs clone using the contract and executable probes; screenshots and notes are evidence, not approval.

**Tech Stack:** Node.js, Playwright, existing arnes scripts, Markdown specs, JSON artifacts, WebM/screenshot evidence, Next.js clone projects as test targets.

---

## Non-Negotiable Principles

- [ ] The deliverable is always real editable web code, never a screenshot or bitmap pretending to be a web.
- [ ] A screenshot-only match can never approve a section.
- [ ] Conversation memory can never approve a section.
- [ ] Notes can never approve a section.
- [ ] A constructor can never approve its own work.
- [ ] Approval requires measured original evidence, measured clone evidence, and an external auditor verdict.
- [ ] Every critical behavior discussed in the thread must become a stored artifact and/or a blocking gate.
- [ ] If a measurement is missing, the section fails.
- [ ] If a probe is missing, the section fails.
- [ ] If the original shows behavior that the clone does not reproduce, the section fails.
- [ ] If a behavior is intentionally not cloned, the decision must exist in `_arnes/DECISIONES.md` before approval.

## Required Coverage From The Conversation

The upgraded arnes must explicitly cover these requirements:

- [ ] Do not approve a web clone from static screenshots.
- [ ] Do not approve a section from a single viewport.
- [ ] Detect `max-width`, centered containers, non-full-width sections, and wide-screen constraints.
- [ ] Detect page-level smooth scroll, scroll delay, inertia, Lenis-like behavior, Framer-like scroll interpolation, and wrapper-based scrolling.
- [ ] Detect hover, focus, click, active, link target, accordion behavior, and card open/closed states.
- [ ] Detect button internals such as duplicated text inside a clipped text window.
- [ ] Detect sticky behavior, pinned stacks, z-index layering, transforms, scale progression, and release timing.
- [ ] Detect overflow ancestors that break sticky or clipping behavior.
- [ ] Detect elements that overflow outside their section.
- [ ] Detect seams with the previous and next section.
- [ ] Detect whether a section visually overlaps, attaches, cuts into, or continues into adjacent sections.
- [ ] Detect different text, visibility, or layout across breakpoints.
- [ ] Detect global wrappers, header overlays, fixed/sticky navigation, and page-level transforms.
- [ ] Preserve all evidence in files so a later session can continue without relying on chat memory.
- [ ] Require a separate auditor agent/session that works from artifacts, not from constructor explanations.
- [ ] Make the test of the arnes itself possible from zero memory.
- [ ] Formalize each section clone as an eval task, not as an informal work item.
- [ ] Formalize each constructor/auditor attempt as a trial with role, allowed actions, forbidden actions, and status.
- [ ] Write a machine-readable trace for every trial.
- [ ] Use code-based graders as the default PASS/FAIL mechanism.
- [ ] Use model-based review only as a secondary perceptual check, never as a replacement for required measurements.
- [ ] Require human decision records for exceptions, broken originals, third-cycle requests, or intentional non-cloning.
- [ ] Add enforcement gates or hooks so missing evidence blocks completion structurally, not by instruction memory.
- [ ] Test the arnes skill with a fresh agent that has no chat memory.

## Canonical Artifact Structure

The upgraded arnes must write artifacts using this structure:

```text
_arnes/eval-suite/<section>/<trial-id>/task.json
_arnes/eval-suite/<section>/<trial-id>/trial.json
_arnes/eval-suite/<section>/<trial-id>/trace.jsonl
_arnes/eval-suite/<section>/<trial-id>/outcome.json
_arnes/eval-suite/<section>/<trial-id>/aggregate.json
_arnes/eval-suite/<section>/<trial-id>/verdict.md
_arnes/eval-suite/<section>/<trial-id>/graders/code-results.json
_arnes/eval-suite/<section>/<trial-id>/graders/model-review.md
_arnes/eval-suite/<section>/<trial-id>/graders/human-required.md
_arnes/page-contract/<viewport>/page-contract.json
_arnes/page-contract/<viewport>/scroll-physics.json
_arnes/render-contract/<section>/<viewport>/initial.json
_arnes/render-contract/<section>/<viewport>/settled.json
_arnes/render-contract/<section>/<viewport>/wide-layout.json
_arnes/render-contract/<section>/<viewport>/hover-<target>.json
_arnes/render-contract/<section>/<viewport>/focus-<target>.json
_arnes/render-contract/<section>/<viewport>/click-<target>.json
_arnes/interaction-film/<section>/<viewport>/report.json
_arnes/interaction-film/<section>/<viewport>/<section>-<viewport>.webm
_arnes/interaction-film/<section>/<viewport>/<state>.png
_arnes/seams/<section>/<viewport>/before.json
_arnes/seams/<section>/<viewport>/after.json
_arnes/seams/<section>/<viewport>/before.png
_arnes/seams/<section>/<viewport>/after.png
_arnes/verify/<section>/<attempt>/audit.md
_arnes/verify/<section>/<attempt>/contract-diff.json
_arnes/verify/<section>/<attempt>/visual-diff-<viewport>.json
_arnes/verify/<section>/<attempt>/visual-diff-<viewport>.png
```

Artifact rules:

- [ ] No raw artifact is overwritten. New attempt, new folder.
- [ ] Every artifact includes `createdAt`, `targetUrl`, `cloneUrl` when applicable, `viewport`, `sectionId`, and `state`.
- [ ] Every artifact includes the script name and command used to create it.
- [ ] Bitacora entries summarize evidence but never replace raw evidence.
- [ ] Auditor reports link to exact artifacts used for every finding.

## Required Viewports And States

Default required viewports:

- [ ] `390x844`
- [ ] `768x1024`
- [ ] `1024x900`
- [ ] `1440x900`
- [ ] `1920x1080`
- [ ] `2560x1440`

Default required section states:

- [ ] `page-load`
- [ ] `before-section`
- [ ] `section-enter`
- [ ] `initial`
- [ ] `settled`
- [ ] `scroll-slow`
- [ ] `scroll-fast`
- [ ] `hover-each-interactive`
- [ ] `focus-each-interactive`
- [ ] `click-each-safe-interactive`
- [ ] `section-exit`
- [ ] `after-section`
- [ ] `wide-layout`

Safe click rule:

- [ ] Links/buttons that would navigate away are inspected for href, target, and click-side effects.
- [ ] If actual clicking would leave the section, the probe records the link target and uses a non-destructive click/focus strategy unless the test explicitly opens a controlled page.

---

## Task 1: Update Base Configuration For Strict Viewports And States

**Files:**
- Modify: `arnes/plantillas/config.json`
- Modify: `_arnes/config.json`
- Modify: `arnes/scripts/_lib/config.mjs`
- Modify: `arnes/scripts/gate.mjs`

- [ ] **Step 1: Add strict viewport defaults**

Add a config shape that supports both old `VIEWPORTS` and new `VIEWPORT_MATRIX`:

```json
{
  "VIEWPORT_MATRIX": [
    { "name": "mobile", "width": 390, "height": 844 },
    { "name": "tablet", "width": 768, "height": 1024 },
    { "name": "laptop", "width": 1024, "height": 900 },
    { "name": "desktop", "width": 1440, "height": 900 },
    { "name": "wide", "width": 1920, "height": 1080 },
    { "name": "ultrawide", "width": 2560, "height": 1440 }
  ]
}
```

- [ ] **Step 2: Add strict state defaults**

Add:

```json
{
  "REQUIRED_RENDER_STATES": [
    "page-load",
    "before-section",
    "section-enter",
    "initial",
    "settled",
    "scroll-slow",
    "scroll-fast",
    "hover-each-interactive",
    "focus-each-interactive",
    "click-each-safe-interactive",
    "section-exit",
    "after-section",
    "wide-layout"
  ]
}
```

- [ ] **Step 3: Preserve backwards compatibility**

If `VIEWPORT_MATRIX` is absent, derive it from `VIEWPORTS` using height `900`. The gate must warn that strict mode is incomplete unless `STRICT_RENDER_CONTRACT: true` is set.

- [ ] **Step 4: Gate strict mode**

When `STRICT_RENDER_CONTRACT: true`, `gate.mjs --fase=2` must fail if any section lacks required artifacts for every viewport matrix entry.

- [ ] **Step 5: Verify failure**

Run:

```powershell
node arnes\scripts\gate.mjs --fase=2
```

Expected:

```text
FAIL strict render contract: missing viewport wide or ultrawide artifact
```

until the new artifacts exist.

---

## Task 2: Build Page Render Contract Probe

**Files:**
- Create: `arnes/scripts/extract-page-contract.mjs`
- Test/fixture: `arnes/fixtures/page-contract/`
- Modify: `arnes/fases/01-captura.md`
- Modify: `arnes/fases/02-spec.md`

- [ ] **Step 1: Extract global browser-render facts**

The script must output:

```json
{
  "html": { "rect": {}, "styles": {} },
  "body": { "rect": {}, "styles": {} },
  "main": { "rect": {}, "styles": {} },
  "scrollRoot": "document|body|custom-wrapper",
  "documentHeight": 0,
  "viewport": { "width": 0, "height": 0 },
  "globalWrappers": [],
  "fixedOrStickyElements": [],
  "loadedScriptSignals": [],
  "sections": []
}
```

- [ ] **Step 2: Include global styles that affect rendering**

For `html`, `body`, `main`, and visible layout wrappers, capture:

```text
display, position, overflow-x, overflow-y, width, height, min-width, max-width,
min-height, max-height, margin, padding, transform, transition, animation,
scroll-behavior, overscroll-behavior, contain, isolation, z-index
```

- [ ] **Step 3: Detect scroll implementation**

The probe must identify:

- document scrolling;
- body scrolling;
- custom wrapper scrolling;
- transforms applied to scroll containers;
- scripts with names or globals indicating Lenis, Locomotive, Framer, GSAP, ScrollTrigger, or smooth-scroll behavior.

- [ ] **Step 4: Detect sticky/fixed overlays**

Capture visible `position: fixed` and `position: sticky` elements, including headers and floating badges, with rect and z-index.

- [ ] **Step 5: Save per viewport**

Write:

```text
_arnes/page-contract/<viewport-name>/page-contract.json
```

- [ ] **Step 6: Acceptance test**

Create a fixture where a wrapper uses `transform: translateY(...)` during smooth scroll. The probe must mark `scrollRoot: custom-wrapper` or include a `globalWrappers` entry with transform.

---

## Task 3: Build Section Render Contract Probe

**Files:**
- Create: `arnes/scripts/extract-render-contract.mjs`
- Modify: `arnes/scripts/extract-section.mjs` only if shared helpers are needed
- Modify: `arnes/plantillas/spec-de-seccion.md`

- [ ] **Step 1: Extract section root and visible descendants**

For the selected section and descendants, capture:

```json
{
  "nodeId": "stable path or generated id",
  "tag": "section",
  "role": "",
  "text": "",
  "rectPage": {},
  "rectViewport": {},
  "rectSection": {},
  "styles": {},
  "attributes": {},
  "children": []
}
```

- [ ] **Step 2: Capture full CSS constraints**

For every relevant visible node, include:

```text
display, position, box-sizing, width, min-width, max-width, height, min-height,
max-height, margin, padding, gap, inset, top, right, bottom, left, overflow-x,
overflow-y, z-index, opacity, transform, transform-origin, transition,
animation-name, animation-duration, animation-delay, animation-timing-function,
will-change, contain, isolation, pointer-events, cursor, border, border-radius,
box-shadow, background-color, background-image, color, font-family, font-size,
font-weight, line-height, letter-spacing, text-align, white-space, object-fit,
object-position
```

- [ ] **Step 3: Capture pseudo-elements**

For `::before` and `::after`, capture:

```text
content, display, position, rect approximation when possible, background,
border, border-radius, transform, opacity, z-index
```

- [ ] **Step 4: Capture CSS variables**

For each node, include CSS custom properties used in computed styles and variables defined on ancestors if they affect the section.

- [ ] **Step 5: Capture ancestor chain**

For every section, store:

```json
{
  "ancestorChain": [
    {
      "tag": "html",
      "selectorPath": "html",
      "rect": {},
      "styles": {
        "overflowX": "",
        "overflowY": "",
        "position": "",
        "transform": "",
        "zIndex": ""
      }
    }
  ]
}
```

This must reveal overflow or transform ancestors that can break sticky behavior.

- [ ] **Step 6: Capture interactive candidates**

Detect:

```text
a, button, input, select, textarea, summary, details, [role=button],
[tabindex], [onclick], cursor:pointer, elements whose hover changes descendants
```

- [ ] **Step 7: Acceptance test**

Fixture: section root has `max-width: 1408px; margin: 0 auto;`. The contract must contain `maxWidth: "1408px"` and measured left/right margins at `1920` and `2560`.

---

## Task 4: Build Responsive Sweep Probe

**Files:**
- Create: `arnes/scripts/probe-responsive-sweep.mjs`
- Modify: `arnes/fases/02-spec.md`
- Modify: `arnes/scripts/gate.mjs`

- [ ] **Step 1: Run section contract across viewport matrix**

For each section, run the render contract probe at every viewport in `VIEWPORT_MATRIX`.

- [ ] **Step 2: Detect container behavior**

For each viewport, compute:

```json
{
  "sectionWidth": 0,
  "viewportWidth": 0,
  "fillsViewport": true,
  "maxWidthDetected": true,
  "centeredDetected": true,
  "leftOuterMargin": 0,
  "rightOuterMargin": 0
}
```

- [ ] **Step 3: Detect breakpoints**

Compare adjacent viewport contracts and record:

- layout changes;
- element visibility changes;
- text changes;
- image source changes;
- font changes;
- section height changes;
- overflow changes.

- [ ] **Step 4: Detect horizontal overflow**

Fail if any visible node extends outside viewport by more than tolerance unless documented in `DECISIONES.md`.

- [ ] **Step 5: Acceptance test**

Original fixture has a max-width container at `1920`; clone fixture incorrectly uses full-width. `compare-render-contract.mjs` must fail with a message like:

```text
FAIL case-studies@1920: container max-width mismatch; original width 1408 centered, clone width 1920 full viewport
```

---

## Task 5: Build Scroll Physics Probe

**Files:**
- Create: `arnes/scripts/probe-scroll-physics.mjs`
- Modify: `arnes/fases/02-spec.md`
- Modify: `arnes/fases/04-verify.md`

- [ ] **Step 1: Apply controlled wheel input**

Use Playwright to apply a fixed wheel event sequence:

```text
wheel deltaY 600 at viewport center
record requestAnimationFrame samples for 1500ms
```

- [ ] **Step 2: Record frame timeline**

For each frame:

```json
{
  "t": 0,
  "scrollY": 0,
  "scrollRootY": 0,
  "mainTransform": "",
  "bodyTransform": "",
  "velocity": 0
}
```

- [ ] **Step 3: Detect scroll inertia**

Mark:

```json
{
  "continuesAfterWheel": true,
  "settleTimeMs": 0,
  "maxVelocity": 0,
  "easingDetected": true,
  "smoothScrollDetected": true
}
```

- [ ] **Step 4: Save video**

Record WebM for the scroll probe:

```text
_arnes/page-contract/<viewport>/scroll-physics.webm
```

- [ ] **Step 5: Compare original vs clone**

If original continues moving after wheel and clone stops immediately, audit fails.

---

## Task 6: Build Interaction Film Probe

**Files:**
- Replace or extend: `arnes/scripts/video-ui-probe.mjs`
- Create: `arnes/scripts/probe-interaction-film.mjs`

- [ ] **Step 1: Identify all interactive elements**

Use the render contract interactive candidate list. Do not use only `.first()` or a single primary card.

- [ ] **Step 2: Record required sequence**

For each section and viewport:

```text
1. start before section
2. slow scroll into section
3. settle
4. hover each interactive element
5. focus each focusable element
6. safe click each safe interactive element
7. slow scroll through section
8. fast scroll through section
9. exit to next section
```

- [ ] **Step 3: Capture before/after diffs per interaction**

For every target:

```json
{
  "target": {},
  "before": {},
  "afterHover": {},
  "afterFocus": {},
  "afterClick": {},
  "changedNodes": []
}
```

- [ ] **Step 4: Detect descendant-only animations**

For hover/focus, compare descendants, not only target root. This must catch:

- duplicated button text;
- clipped text windows;
- child transforms;
- background changes;
- card open/closed states;
- accordion height changes.

- [ ] **Step 5: Record video and screenshots**

Write:

```text
_arnes/interaction-film/<section>/<viewport>/report.json
_arnes/interaction-film/<section>/<viewport>/<section>-<viewport>.webm
_arnes/interaction-film/<section>/<viewport>/<state>.png
```

- [ ] **Step 6: Acceptance test**

Fixture: accordion opens second card on hover. Clone lacks hover behavior. Audit must fail with:

```text
FAIL interaction hover-card-2: original open height changed from 82 to 230, clone unchanged
```

---

## Task 7: Build Seam Probe For Previous And Next Section

**Files:**
- Create: `arnes/scripts/probe-section-seams.mjs`
- Modify: `arnes/fases/02-spec.md`
- Modify: `arnes/fases/04-verify.md`

- [ ] **Step 1: Identify previous/current/next sections**

From `captura/secciones.json` or page contract, get:

```json
{
  "previous": {},
  "current": {},
  "next": {}
}
```

- [ ] **Step 2: Measure top seam**

At the boundary between previous and current:

- bottom of previous;
- top of current;
- gap;
- overlap;
- z-index ordering;
- background continuity;
- elements from previous entering current;
- elements from current entering previous.

- [ ] **Step 3: Measure bottom seam**

At the boundary between current and next:

- bottom of current;
- top of next;
- gap;
- overlap;
- z-index ordering;
- background continuity;
- elements from current entering next;
- elements from next entering current.

- [ ] **Step 4: Detect section overflow**

List visible descendants whose rect extends outside current section root.

- [ ] **Step 5: Save seam crops**

Write:

```text
_arnes/seams/<section>/<viewport>/before.png
_arnes/seams/<section>/<viewport>/after.png
_arnes/seams/<section>/<viewport>/before.json
_arnes/seams/<section>/<viewport>/after.json
```

- [ ] **Step 6: Acceptance test**

Fixture: an image overlaps the next section by 80px. Clone clips the image. Audit must fail.

---

## Task 8: Update Section Spec Template Into Render Contract Spec

**Files:**
- Modify: `arnes/plantillas/spec-de-seccion.md`

- [ ] **Step 1: Replace vague sections with mandatory measured sections**

Required headings:

```markdown
## Identidad
## Page Render Contract
## Container Contract
## Ancestor Chain
## Geometry Matrix
## Typography Matrix
## Color And Paint Matrix
## Asset Contract
## Interactive State Matrix
## Scroll And Motion Contract
## Responsive Sweep
## Top Seam Contract
## Bottom Seam Contract
## Known Non-Cloned Decisions
## Failure Criteria
## Required Evidence
```

- [ ] **Step 2: Ban vague language**

Gate must fail if spec contains:

```text
aprox
parece
si existe
revisar durante build
pendiente
TBD
TODO
por ajustar
```

- [ ] **Step 3: Require artifact references**

Each section of the spec must reference exact artifact paths.

- [ ] **Step 4: Acceptance test**

Spec with “Si existen tarjetas/links...” must fail phase 2.

---

## Task 9: Build Render Contract Comparator

**Files:**
- Create: `arnes/scripts/compare-render-contract.mjs`
- Modify: `arnes/fases/04-verify.md`
- Modify: `arnes/scripts/gate.mjs`

- [ ] **Step 1: Compare geometry**

Compare:

- section rect;
- container rect;
- child rects;
- relative offsets;
- section height;
- page position;
- wide-screen margins.

- [ ] **Step 2: Compare CSS constraints**

Compare:

- max-width;
- min-width;
- width;
- overflow;
- position;
- z-index;
- transform;
- sticky/fixed behavior;
- ancestor chain.

- [ ] **Step 3: Compare interaction states**

Compare before/after interaction contracts for every interactive element.

- [ ] **Step 4: Compare scroll physics**

Compare original vs clone scroll timeline:

- settle time;
- continued motion;
- smooth behavior;
- root scroll container;
- wrapper transforms.

- [ ] **Step 5: Compare seams**

Compare top and bottom seam contracts.

- [ ] **Step 6: Output actionable findings**

Each finding must include:

```json
{
  "severity": "P0|P1|P2|P3",
  "section": "",
  "viewport": "",
  "state": "",
  "selectorPath": "",
  "expected": "",
  "actual": "",
  "artifact": ""
}
```

- [ ] **Step 7: Acceptance test**

If original uses `max-width: 1408px` and clone uses full viewport, comparator fails even if screenshot diff is under threshold.

---

## Task 10: Harden Gates For Missing Evidence

**Files:**
- Modify: `arnes/scripts/gate.mjs`

Phase 2 must fail when:

- [ ] Missing page contract.
- [ ] Missing render contract for any required section/viewport.
- [ ] Missing responsive sweep.
- [ ] Missing interaction film for a section with interactive elements.
- [ ] Missing seam probe.
- [ ] Missing scroll physics probe.
- [ ] Spec contains vague language.
- [ ] Spec lacks artifact references.

Phase 4 must fail when:

- [ ] Auditor report is missing.
- [ ] Auditor report lacks external auditor signature.
- [ ] Any contract comparison fails.
- [ ] Any visual diff fails.
- [ ] Any required viewport is missing.
- [ ] Any required interaction state is missing.
- [ ] Constructor signed or edited the audit.

---

## Task 11: Enforce External Auditor Workflow

**Files:**
- Modify: `arnes/plantillas/prompt-auditor.md`
- Modify: `arnes/fases/04-verify.md`
- Modify: `arnes/scripts/gate.mjs`

- [ ] **Step 1: Auditor identity**

Auditor prompt must state:

```text
You are the auditor. You did not build this. You do not trust the constructor. You approve only from artifacts.
```

- [ ] **Step 2: Auditor cannot read clone source first**

The auditor may inspect source only after recording artifact-based findings.

- [ ] **Step 3: Auditor must fail missing evidence**

No evidence means FAIL, not “probably fine”.

- [ ] **Step 4: Auditor report schema**

Audit report must include:

```markdown
AUDIT_FAIL | AUDIT_PASS | REAUDIT_FAIL | REAUDIT_PASS
Auditor session id:
Attempt:
Artifacts reviewed:
Blocking findings:
Non-blocking findings:
Decision:
```

- [ ] **Step 5: Gate signature**

`gate.mjs` must reject PASS reports without valid auditor signature marker.

---

## Task 12: Add Test Fixtures That Prove The Arnes Catches Known Failures

**Files:**
- Create: `arnes/fixtures/strict-render-contract/`
- Create: `arnes/tests/strict-render-contract.test.mjs`

Fixtures:

- [ ] Max-width original vs full-width clone.
- [ ] Smooth scroll original vs normal scroll clone.
- [ ] Sticky stack original vs translate-only clone.
- [ ] Accordion hover original vs static clone.
- [ ] Button clipped duplicate text original vs simple color hover clone.
- [ ] Overflowing section element original vs clipped clone.
- [ ] Ancestor overflow breaking sticky.
- [ ] Text changing by breakpoint.
- [ ] Seam overlap between sections.

Each fixture must include:

```text
original.html
clone-bad.html
clone-good.html
expected-failures.json
```

Acceptance:

- [ ] `clone-bad.html` fails for the expected reason.
- [ ] `clone-good.html` passes.
- [ ] Failure messages name the missing behavior exactly.

---

## Task 13: Update Documentation And Phase Instructions

**Files:**
- Modify: `arnes/SKILL.md`
- Modify: `arnes/fases/01-captura.md`
- Modify: `arnes/fases/02-spec.md`
- Modify: `arnes/fases/03-build.md`
- Modify: `arnes/fases/04-verify.md`
- Modify: `arnes/referencias/INDEX.md`
- Create: `arnes/referencias/17-render-contract-estricto.md`

Documentation must state:

- [ ] The target is the browser render, not a screenshot.
- [ ] DOM alone is insufficient.
- [ ] Screenshot alone is insufficient.
- [ ] Section alone is insufficient.
- [ ] Page context is required.
- [ ] Previous/next seams are required.
- [ ] Responsive wide viewports are required.
- [ ] Interactions are required.
- [ ] Scroll physics are required.
- [ ] External auditor is required.
- [ ] Notes do not approve work.
- [ ] Missing evidence equals FAIL.

---

## Task 14: Run A Zero-Memory Fire Test

**Target:** `https://drardens.framer.website/`

**Section:** `Case studies`

Process:

- [ ] Start from clean arnes artifacts or a new test folder.
- [ ] Do not use prior chat conclusions.
- [ ] Run page contract.
- [ ] Run render contract for Case studies.
- [ ] Run responsive sweep.
- [ ] Run interaction film.
- [ ] Run scroll physics.
- [ ] Run seam probe.
- [ ] Build or inspect the existing clone.
- [ ] Run external audit.

Expected detections:

- [ ] Detect accordion hover behavior.
- [ ] Detect button inner text animation if present.
- [ ] Detect container width/max-width behavior at wide viewports.
- [ ] Detect if section is not full-width.
- [ ] Detect relation to previous and next section.
- [ ] Detect global scroll behavior.
- [ ] Fail if clone is full-width when original is constrained.
- [ ] Fail if clone lacks required interaction states.
- [ ] Fail if constructor tries to approve.

---

## Task 15: Build Formal Eval Suite Runner

**Files:**
- Create: `arnes/scripts/eval-suite.mjs`
- Create: `arnes/scripts/_lib/eval-suite.mjs`
- Modify: `arnes/scripts/gate.mjs`
- Modify: `arnes/plantillas/config.json`
- Modify: `_arnes/config.json`

- [ ] **Step 1: Add eval-suite configuration**

`arnes/plantillas/config.json` and `_arnes/config.json` must include:

```json
{
  "EVAL_SUITE_DIR": "_arnes/eval-suite",
  "REQUIRE_TRACE": true,
  "REQUIRE_CODE_GRADERS": true,
  "REQUIRE_EXTERNAL_AUDITOR": true,
  "ALLOW_MODEL_GRADER_TO_OVERRIDE_CODE_FAIL": false
}
```

- [ ] **Step 2: Define task schema**

`arnes/scripts/_lib/eval-suite.mjs` must export a task validator that requires:

```js
const REQUIRED_TASK_FIELDS = [
  'taskId',
  'targetUrl',
  'cloneUrl',
  'sectionId',
  'selectorOriginal',
  'selectorClone',
  'mode',
  'requiredViewports',
  'requiredStates',
  'passPolicy',
  'constructorMayApprove'
];
```

Validation rules:

- `taskId` is non-empty string.
- `targetUrl` and `cloneUrl` are valid URLs.
- `requiredViewports` contains all configured viewports.
- `requiredStates` contains all default required states.
- `constructorMayApprove` must be `false`.
- `passPolicy` must be `all-required-graders-pass`.

- [ ] **Step 3: Define trial schema**

The same helper must validate:

```js
const REQUIRED_TRIAL_FIELDS = [
  'trialId',
  'taskId',
  'role',
  'startedAt',
  'agent',
  'allowedActions',
  'forbiddenActions',
  'status'
];
```

Validation rules:

- `role` is `constructor` or `auditor`.
- constructor trial must forbid `write-audit-pass`.
- auditor trial must forbid `edit-clone`.
- `status` is `running`, `failed`, `passed`, or `blocked`.

- [ ] **Step 4: Implement runner commands**

`arnes/scripts/eval-suite.mjs` must support:

```text
node arnes/scripts/eval-suite.mjs start --section=<id> --role=constructor --clone-url=<url>
node arnes/scripts/eval-suite.mjs start --section=<id> --role=auditor --clone-url=<url>
node arnes/scripts/eval-suite.mjs aggregate --section=<id> --trial=<trial-id>
node arnes/scripts/eval-suite.mjs list --section=<id>
```

Expected behavior:

- `start` creates a new unique trial folder.
- `start` writes `task.json`, `trial.json`, empty `trace.jsonl`, and initial `outcome.json`.
- `aggregate` reads grader outputs and writes `aggregate.json`.
- `list` prints trials with role, status, and verdict.

- [ ] **Step 5: Gate integration**

`gate.mjs --fase=4` and `gate.mjs --fase=5` must fail when:

- no eval-suite trial exists for a verified section;
- task.json is missing or invalid;
- trial.json is missing or invalid;
- aggregate.json is missing;
- aggregate verdict is not PASS;
- constructor trial contains auditor PASS.

Acceptance:

```text
node arnes/scripts/eval-suite.mjs start --section=case-studies --role=constructor --clone-url=http://localhost:3001/#case-studies
```

Expected:

- creates `_arnes/eval-suite/case-studies/<trial-id>/`;
- writes task/trial/trace/outcome files;
- exits 0.

---

## Task 16: Build Grader Architecture

**Files:**
- Create: `arnes/scripts/graders/run-graders.mjs`
- Create: `arnes/scripts/graders/artifact-presence.mjs`
- Create: `arnes/scripts/graders/viewport-coverage.mjs`
- Create: `arnes/scripts/graders/max-width-container.mjs`
- Create: `arnes/scripts/graders/interaction-state.mjs`
- Create: `arnes/scripts/graders/scroll-physics.mjs`
- Create: `arnes/scripts/graders/seam.mjs`
- Create: `arnes/scripts/graders/role-permission.mjs`
- Create: `arnes/scripts/graders/trace-completeness.mjs`
- Modify: `arnes/scripts/gate.mjs`

- [ ] **Step 1: Define grader output contract**

Every grader must write entries shaped like:

```json
{
  "grader": "max-width-container",
  "verdict": "PASS",
  "sectionId": "case-studies",
  "viewport": "1440x900",
  "state": "wide-layout",
  "blocking": true,
  "expected": {},
  "actual": {},
  "artifactRefs": [],
  "message": "PASS"
}
```

Required fields:

- `grader`;
- `verdict`;
- `sectionId`;
- `blocking`;
- `artifactRefs`;
- `message`.

- [ ] **Step 2: Implement artifact presence grader**

Fails if any required artifact path is missing:

- page contract;
- render contract per viewport;
- responsive sweep;
- scroll physics;
- interaction film for interactive sections;
- seam before/after;
- visual diff;
- trace.

- [ ] **Step 3: Implement viewport coverage grader**

Fails if a section lacks evidence for any required viewport:

- `390x844`;
- `768x1024`;
- `1024x900`;
- `1440x900`;
- `1920x1080`;
- `2560x1440`.

- [ ] **Step 4: Implement max-width/container grader**

Compares original vs clone:

- section width;
- inner container width;
- max-width;
- left/right centering;
- full-width vs constrained behavior;
- wide viewport behavior.

This grader must catch the Case studies failure where a constrained original is implemented as full width.

- [ ] **Step 5: Implement interaction-state grader**

For each interactive element, compare:

- hover before/after DOM snapshot;
- computed styles before/after;
- transforms;
- opacity;
- background;
- text movement;
- clipped text windows;
- focus outline/state;
- safe click behavior and href/target.

- [ ] **Step 6: Implement scroll physics grader**

Compare original vs clone:

- scroll root;
- smooth/inertial scroll markers;
- scroll-linked transforms;
- sticky pin start/end;
- scale progression;
- release timing;
- scroll slow vs fast differences.

- [ ] **Step 7: Implement seam grader**

Compare previous/next section relationships:

- overlap;
- negative margins;
- sticky header crossing;
- section cut-in;
- element overflow into adjacent section;
- background continuation.

- [ ] **Step 8: Implement role-permission grader**

Fails when:

- constructor writes `AUDIT_PASS`;
- auditor edits clone source;
- original frozen evidence is overwritten;
- a trial is missing role metadata.

- [ ] **Step 9: Implement trace-completeness grader**

Fails when trace lacks:

- trial_started;
- probe_started/probe_finished for each required probe;
- artifact_written for required artifacts;
- grader_result for each required grader;
- trial_finished.

- [ ] **Step 10: Aggregate results**

`run-graders.mjs` writes:

```text
_arnes/eval-suite/<section>/<trial-id>/graders/code-results.json
_arnes/eval-suite/<section>/<trial-id>/aggregate.json
```

PASS rule:

- all blocking code-based graders PASS;
- model review does not override code-based FAIL;
- human-required blocks PASS until `_arnes/DECISIONES.md` contains the decision.

---

## Task 17: Add Trial Transcript / Trace JSONL

**Files:**
- Create: `arnes/scripts/_lib/trace.mjs`
- Modify: `arnes/scripts/capture.mjs`
- Modify: `arnes/scripts/extract-section.mjs`
- Modify: `arnes/scripts/diff-visual.mjs`
- Modify: `arnes/scripts/video-ui-probe.mjs`
- Modify: `arnes/scripts/eval-suite.mjs`

- [ ] **Step 1: Create trace writer**

`trace.mjs` must export:

```js
appendTrace({ trialDir, event, data });
hashFile(path);
traceArtifact({ trialDir, path, kind, sectionId, viewport, state });
```

Rules:

- one JSON object per line;
- every event includes `ts`, `event`, and `trialId`;
- artifact events include path and sha256;
- trace append never overwrites previous lines.

- [ ] **Step 2: Required events**

Each trial must include:

```text
trial_started
probe_started
probe_finished
artifact_written
interaction_started
interaction_finished
grader_started
grader_result
trial_finished
```

- [ ] **Step 3: Instrument probes**

Every probe script must accept:

```text
--trial-dir=_arnes/eval-suite/<section>/<trial-id>
```

When present, it writes trace events for:

- command started;
- URL opened;
- viewport set;
- selector located;
- scroll step;
- hover/focus/click step;
- artifact written;
- command finished.

- [ ] **Step 4: Gate trace completeness**

`gate.mjs --fase=4` must fail if:

- trace file missing;
- trace is not valid JSONL;
- required event types are missing;
- artifacts referenced by audit are absent from trace.

---

## Task 18: Add Hooks / Enforcement Layer

**Files:**
- Create: `arnes/hooks/README.md`
- Create: `arnes/hooks/stop-verify-required.mjs`
- Create: `arnes/hooks/prevent-constructor-audit-pass.mjs`
- Create: `arnes/hooks/prevent-frozen-artifact-overwrite.mjs`
- Modify: `arnes/scripts/gate.mjs`
- Modify: `arnes/SKILL.md`

- [ ] **Step 1: Document hook purpose**

`arnes/hooks/README.md` must explain:

- hooks are enforcement, not guidance;
- if the host supports hooks, install them;
- if the host does not support hooks, `gate.mjs` must enforce equivalent rules;
- memory and markdown rules are not enough.

- [ ] **Step 2: Stop hook**

`stop-verify-required.mjs` blocks completion language when:

- aggregate.json missing;
- aggregate verdict not PASS;
- audit report missing;
- required graders missing;
- trace incomplete.

- [ ] **Step 3: Constructor PASS blocker**

`prevent-constructor-audit-pass.mjs` blocks writes containing:

```text
AUDIT_PASS
REAUDIT_PASS
```

when the active trial role is `constructor`.

- [ ] **Step 4: Frozen artifact overwrite blocker**

`prevent-frozen-artifact-overwrite.mjs` blocks writes to:

```text
_arnes/captura/
_arnes/page-contract/
_arnes/render-contract/
_arnes/interaction-film/
_arnes/seams/
```

unless the command is creating a new trial/attempt folder.

- [ ] **Step 5: Gate fallback**

`gate.mjs` must enforce the same conditions even if hooks never ran.

---

## Task 19: Create `arnes-render-contract` Skill Layer

**Files:**
- Modify: `arnes/SKILL.md`
- Create: `arnes/referencias/18-anthropic-harness-operating-model.md`
- Create: `arnes/referencias/19-eval-suite-graders-trace.md`
- Create: `arnes/referencias/20-fresh-agent-fire-test.md`

- [ ] **Step 1: Keep SKILL small**

`arnes/SKILL.md` must not copy the whole plan. It must only:

- decide if the user request is web cloning;
- read `_arnes/config.json`, `_arnes/LEDGER.md`, and last `_arnes/BITACORA.md` lines;
- run gates to identify the current phase;
- load only the current phase file;
- load strict references only when the phase requires them.

- [ ] **Step 2: Add activation rule**

The skill must state:

```text
If the clone requires fidelity, sticky behavior, scroll-linked animation, hover/click/focus behavior, responsive parity, or section seams, activate the strict render contract path and the eval-suite path.
```

- [ ] **Step 3: Add progressive disclosure references**

The new references must point to:

- `_arnes/ANEXO-ANTHROPIC-HARNESS-OPERATING-MODEL.md`;
- `_arnes/INVESTIGACION-ANTHROPIC-HARNESSES.md`;
- `_arnes/PLAN-ARNES-ESTRICTO-RENDER-CONTRACT.md`.

- [ ] **Step 4: Add no-memory warning**

The skill must state:

```text
Conversation memory is not evidence. Only stored artifacts, trace, graders, audit report, and gates can approve a section.
```

---

## Task 20: Fresh-Agent Skill Evaluation

**Files:**
- Create: `arnes/tests/fresh-agent-fire-test.md`
- Create: `arnes/tests/fresh-agent-expected-results.json`
- Create: `_arnes/verify/fresh-agent-case-studies-checklist.md`

**Target:** `https://drardens.framer.website/`

**Section:** `Case studies`

- [ ] **Step 1: Prepare zero-memory prompt**

The test prompt must not mention prior discoveries. It must only provide:

- target URL;
- local clone URL;
- instruction to use arnes;
- section name;
- no hints about max-width, hover, scroll, or seams.

- [ ] **Step 2: Expected detections**

The fresh agent must independently detect:

- if Case studies is constrained or full-width;
- section max-width and centering at wide viewports;
- hover behavior of interactive elements;
- click/focus behavior where safe;
- scroll entry and exit behavior;
- relationship to previous and next sections;
- whether global scroll has delay/inertia/interpolation;
- missing evidence as FAIL.

- [ ] **Step 3: Expected artifacts**

The fresh agent must produce:

- task.json;
- trial.json;
- trace.jsonl;
- render contract artifacts;
- interaction film artifacts;
- scroll physics artifacts;
- seam artifacts;
- code-results.json;
- aggregate.json;
- audit or pre-audit verdict.

- [ ] **Step 4: Failure conditions**

The fresh-agent test fails if:

- it approves from screenshots only;
- it misses wide viewport max-width;
- it misses hover behavior;
- it does not inspect adjacent sections;
- it does not write trace;
- it tries to self-approve as constructor;
- it cannot explain each PASS/FAIL with artifact references.

---

## Final Definition Of Done

The arnes upgrade is complete only when all checks below are true:

- [ ] A clone with missing hover behavior fails.
- [ ] A clone with missing click/focus behavior fails.
- [ ] A clone with wrong `max-width` fails.
- [ ] A clone with wrong wide-screen layout fails.
- [ ] A clone with wrong scroll physics fails.
- [ ] A clone with wrong sticky behavior fails.
- [ ] A clone with wrong overflow ancestor behavior fails.
- [ ] A clone with wrong section seam fails.
- [ ] A clone with missing responsive breakpoint behavior fails.
- [ ] A clone with missing evidence fails.
- [ ] A constructor-authored PASS fails.
- [ ] An auditor PASS with incomplete artifacts fails.
- [ ] A trial without trace fails.
- [ ] A trial without aggregate.json fails.
- [ ] A model-based visual review cannot override a blocking code-based FAIL.
- [ ] A human exception cannot pass without a decision in `_arnes/DECISIONES.md`.
- [ ] A fresh agent can activate the arnes skill and reach the strict render-contract/eval-suite path without chat memory.
- [ ] A correct fixture clone passes.
- [ ] The Dr. Ardens Case studies zero-memory fire test finds the same class of issues discussed in this thread.
- [ ] A new worker can read this plan and implement without asking what each point means.
