# Sleep Lab

A browser-based trial-and-error sleep game by **Myo Family Health**.

A 3D cosy bedroom shows a sleeping person. A HUD panel controls physiological and
environmental variables — tongue rest position, lip seal, sleeping position, pillow
height, room temperature, light, pre-bed activity, and where the dog sleeps. Press
**Simulate Night** to run 23:00 → 07:00 with a live event log, then read the morning
report: a 0–100 sleep score, a hypnogram, clinical notes on the night's weakest
points, and six measures.

There is deliberately **no tutorial** — discover the winning combination by experiment.

## Running locally

The game is a static site. Serve the folder over HTTP (an ES-module import map needs a
real origin, so opening `index.html` from `file://` will not work):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Structure

- `index.html` — document shell, HUD markup, mouth-diagram SVG, morning-report modal, all CSS.
- `bedroom.js` — three.js scene construction, pose logic, diagram redraw, breathing and Z
  animation, the scoring model, the night-simulation loop, and hypnogram/report rendering.
- `three-d-stage.js` — the reusable `<three-d-stage>` web component: renderer, lighting,
  ground shadow, OrbitControls, auto-framing camera, and OBJ/GLB export toolbar.
- `assets/` — Myo Family Health brand marks.

three.js r0.184.0 is loaded from unpkg via an import map with SRI hashes; fonts load from
Google Fonts. No build step, no dependencies to install.
