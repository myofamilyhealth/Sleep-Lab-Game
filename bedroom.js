import * as THREE from 'three';

const stage = document.querySelector('three-d-stage');
await stage.ready;

/* ---------- materials ---------- */
const M = {
  wood:    new THREE.MeshStandardMaterial({ name:'oak_floor',  color:0x7c5636, roughness:0.72 }),
  wall:    new THREE.MeshStandardMaterial({ name:'wall_plaster', color:0x232f52, roughness:0.95 }),
  linen:   new THREE.MeshStandardMaterial({ name:'linen',      color:0x51689e, roughness:0.85 }),
  duvet:   new THREE.MeshStandardMaterial({ name:'duvet_wool', color:0x1d2c56, roughness:0.95 }),
  frame:   new THREE.MeshStandardMaterial({ name:'walnut',     color:0x4a3123, roughness:0.55 }),
  skin:    new THREE.MeshStandardMaterial({ name:'skin',       color:0xd8a583, roughness:0.75 }),
  hair:    new THREE.MeshStandardMaterial({ name:'hair',       color:0x241a18, roughness:0.85 }),
  brass:   new THREE.MeshStandardMaterial({ name:'brass',      color:0xd6a44f, roughness:0.35, metalness:0.35 }),
  rug:     new THREE.MeshStandardMaterial({ name:'rug_wool',   color:0x9a5f52, roughness:1 }),
  shade:   new THREE.MeshStandardMaterial({ name:'lampshade',  color:0xf6e2bd, roughness:0.6,
             emissive:0xffcf8a, emissiveIntensity:0.9, side:THREE.DoubleSide }),
  leaf:    new THREE.MeshStandardMaterial({ name:'foliage',    color:0x4d7b58, roughness:0.9 }),
  dark:    new THREE.MeshStandardMaterial({ name:'shadow_gap', color:0x2a1c24, roughness:1 }),
  tongue:  new THREE.MeshStandardMaterial({ name:'tongue',     color:0xc4707f, roughness:0.85 }),
  fur:     new THREE.MeshStandardMaterial({ name:'fur',        color:0xb98a5e, roughness:0.95 }),
  furDark: new THREE.MeshStandardMaterial({ name:'fur_dark',   color:0x6d4c33, roughness:0.95 }),
};

const box = (w,h,d,mat,name,x=0,y=0,z=0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
  m.name = name; m.position.set(x,y,z); return m;
};
const cyl = (rt,rb,h,mat,name,seg=32) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg), mat); m.name = name; return m;
};

const cap = (r,l,mat,name) => {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r,l,8,24), mat);
  m.name = name; m.rotation.x = Math.PI/2; return m;
};
const room = new THREE.Group(); room.name = 'cosy_bedroom';

/* ---------- shell ---------- */
room.add(box(4.4,0.08,3.8,M.wood,'floor',0,-0.04,0));
const rug = cyl(1.1,1.1,0.02,M.rug,'rug',48); rug.position.set(0.85,0.012,0.75); room.add(rug);
room.add(box(0.1,2.5,3.8,M.wall,'wall_left',-2.25,1.25,0));

// back wall built around a window opening (x 0.35..1.75, y 1.05..1.95)
const WZ = -1.95;
room.add(box(4.4,1.05,0.1,M.wall,'wall_back_sill',0,0.525,WZ));
room.add(box(4.4,0.55,0.1,M.wall,'wall_back_upper',0,2.225,WZ));
room.add(box(0.35,0.9,0.1,M.wall,'wall_back_left',-2.025,1.5,WZ));
room.add(box(2.65,0.9,0.1,M.wall,'wall_back_right',0.875,1.5,WZ));
room.add(box(1.5,0.06,0.16,M.frame,'window_sill',-1.15,1.02,WZ+0.03));
room.add(box(0.06,0.95,0.14,M.frame,'window_mullion',-1.15,1.5,WZ+0.02));

const sky = new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.1),
  new THREE.MeshBasicMaterial({ name:'night_sky', color:0x1b2a52 }));
sky.name = 'sky'; sky.position.set(-1.15,1.5,WZ-0.06); room.add(sky);
const moon = new THREE.Mesh(new THREE.SphereGeometry(0.09,24,16),
  new THREE.MeshBasicMaterial({ name:'moon', color:0xf6efd8 }));
moon.name = 'moon'; moon.position.set(-1.55,1.75,WZ-0.05); room.add(moon);

/* ---------- bed ---------- */
const bed = new THREE.Group(); bed.name = 'bed'; bed.position.set(-1.28,0,-0.62); room.add(bed);
bed.add(box(1.62,0.28,2.1,M.frame,'bed_frame',0,0.16,0));
bed.add(box(1.62,0.7,0.09,M.frame,'headboard',0,0.5,-1.1));
bed.add(box(1.5,0.26,2.0,M.linen,'mattress',0,0.42,0));
for (const [n,x,z] of [['bed_leg_a',-0.72,0.95],['bed_leg_b',0.72,0.95],['bed_leg_c',-0.72,-0.95],['bed_leg_d',0.72,-0.95]])
  bed.add(box(0.09,0.14,0.09,M.frame,n,x,0.07,z));

const pillow = box(0.92,0.17,0.42,M.linen,'pillow',0,0.62,-0.74); bed.add(pillow);
const duvet = box(1.54,0.16,1.5,M.duvet,'duvet',0,0.6,0.22); bed.add(duvet);
const duvetFold = box(1.54,0.1,0.2,M.linen,'duvet_fold',0,0.63,-0.5); bed.add(duvetFold);
const chest = cap(0.23,0.34,M.duvet,'sleeper_chest');
chest.position.set(0,0.6,-0.3); chest.scale.set(1,0.68,1); bed.add(chest);
const hips = cap(0.235,0.24,M.duvet,'sleeper_hips');
hips.position.set(0.02,0.585,0.24); hips.scale.set(1,0.62,1); bed.add(hips);
const legs = cap(0.16,0.62,M.duvet,'sleeper_legs');
legs.position.set(0.05,0.565,0.68); legs.scale.set(1.05,0.55,1); bed.add(legs);
const feet = new THREE.Mesh(new THREE.SphereGeometry(0.13,24,18), M.duvet);
feet.name = 'sleeper_feet'; feet.position.set(0.05,0.578,0.94); feet.scale.set(1,0.6,0.8); bed.add(feet);
const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.19,28,20), M.duvet);
shoulder.name = 'sleeper_shoulder'; shoulder.position.set(0,0.6,-0.56); shoulder.scale.set(1.15,0.62,0.9); bed.add(shoulder);

/* sleeper */
const sleeper = new THREE.Group(); sleeper.name = 'sleeper'; sleeper.position.set(0,0.78,-0.72); bed.add(sleeper);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.135,32,24), M.skin);
head.name = 'head'; head.scale.set(0.92,1.1,1.14); sleeper.add(head);
const hair = new THREE.Mesh(new THREE.SphereGeometry(0.142,32,24,0,Math.PI*2,0,Math.PI*0.62), M.hair);
hair.name = 'hair'; hair.scale.set(1,1.12,1.16); hair.position.set(0,0.015,-0.03); sleeper.add(hair);
const nose = new THREE.Mesh(new THREE.ConeGeometry(0.028,0.06,16), M.skin);
nose.name = 'nose'; nose.rotation.x = Math.PI/2; nose.position.set(0,0.0,0.145); sleeper.add(nose);
for (const [n,x] of [['eyelid_l',-0.055],['eyelid_r',0.055]]) {
  const e = box(0.04,0.006,0.012,M.hair,n,x,0.035,0.128); sleeper.add(e);
}
const mouth = box(0.062,0.012,0.03,M.dark,'mouth',0,-0.062,0.128); sleeper.add(mouth);
const tongueMesh = box(0.05,0.014,0.05,M.tongue,'tongue',0,-0.062,0.112); sleeper.add(tongueMesh);
const arm = cap(0.062,0.3,M.duvet,'arm'); arm.position.set(0.29,-0.14,0.16);
arm.rotation.z = 0.22; sleeper.add(arm);
const hand = new THREE.Mesh(new THREE.SphereGeometry(0.055,20,16), M.skin);
hand.name = 'hand'; hand.position.set(0.24,-0.13,0.34); hand.scale.set(1,0.7,1.1); sleeper.add(hand);
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.062,0.075,0.1,20), M.skin);
neck.name = 'neck'; neck.position.set(0,-0.11,-0.03); sleeper.add(neck);
const headGrp = new THREE.Group(); headGrp.name = 'head_group';
headGrp.rotation.order = 'ZXY'; sleeper.add(headGrp);
['head','hair','nose','eyelid_l','eyelid_r','mouth','tongue'].forEach(n => {
  const m = sleeper.getObjectByName(n); if (m) headGrp.add(m);
});

/* ---------- dog ---------- */
const dog = new THREE.Group(); dog.name = 'dog';
const dogBody = new THREE.Mesh(new THREE.SphereGeometry(0.17,28,20), M.fur);
dogBody.name = 'dog_body'; dogBody.scale.set(1.25,0.82,1.0); dogBody.position.y = 0.14; dog.add(dogBody);
const dogHead = new THREE.Mesh(new THREE.SphereGeometry(0.105,28,20), M.fur);
dogHead.name = 'dog_head'; dogHead.position.set(0.19,0.12,0.11); dogHead.scale.set(1,0.95,1); dog.add(dogHead);
const dogSnout = new THREE.Mesh(new THREE.SphereGeometry(0.055,20,16), M.furDark);
dogSnout.name = 'dog_snout'; dogSnout.position.set(0.24,0.085,0.2); dogSnout.scale.set(0.9,0.8,1.3); dog.add(dogSnout);
const dogNose = new THREE.Mesh(new THREE.SphereGeometry(0.022,16,12), M.dark);
dogNose.name = 'dog_nose'; dogNose.position.set(0.25,0.09,0.265); dog.add(dogNose);
for (const [n,x,z,r] of [['dog_ear_l',0.13,0.03,-0.5],['dog_ear_r',0.24,0.06,0.35]]) {
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.055,18,14), M.furDark);
  e.name = n; e.position.set(x,0.16,z); e.scale.set(0.42,1.1,0.85); e.rotation.z = r; dog.add(e);
}
const dogTail = new THREE.Mesh(new THREE.TorusGeometry(0.1,0.028,12,28,Math.PI*1.15), M.fur);
dogTail.name = 'dog_tail'; dogTail.position.set(-0.17,0.1,0.07);
dogTail.rotation.set(Math.PI/2,0,0.6); dog.add(dogTail);
const dogPaw = new THREE.Mesh(new THREE.SphereGeometry(0.05,18,14), M.fur);
dogPaw.name = 'dog_paw'; dogPaw.position.set(0.16,0.05,0.2); dogPaw.scale.set(1.4,0.6,1); dog.add(dogPaw);
const dogBedCushion = new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.3,0.1,32), M.rug);
dogBedCushion.name = 'dog_cushion'; dogBedCushion.position.y = 0.05; dog.add(dogBedCushion);
room.add(dog);

/* ---------- nightstand + lamp ---------- */
const stand = new THREE.Group(); stand.name = 'nightstand'; stand.position.set(0.55,0,-1.45); room.add(stand);
stand.add(box(0.46,0.05,0.4,M.frame,'stand_top',0,0.52,0));
stand.add(box(0.42,0.44,0.36,M.linen,'stand_body',0,0.29,0));
stand.add(box(0.3,0.012,0.012,M.brass,'stand_handle',0,0.32,0.185));
const lampBase = cyl(0.045,0.07,0.1,M.brass,'lamp_base',24); lampBase.position.set(0,0.6,0); stand.add(lampBase);
const lampStem = cyl(0.012,0.012,0.18,M.brass,'lamp_stem',16); lampStem.position.set(0,0.73,0); stand.add(lampStem);
const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.13,0.15,32,1,true), M.shade);
lampShade.name = 'lamp_shade'; lampShade.position.set(0,0.87,0); stand.add(lampShade);
const bookA = box(0.16,0.03,0.12,M.rug,'book_a',-0.1,0.565,0.06); stand.add(bookA);
const bookB = box(0.15,0.025,0.11,M.duvet,'book_b',-0.1,0.593,0.05); stand.add(bookB);

/* ---------- plant + art ---------- */
const plant = new THREE.Group(); plant.name = 'plant'; plant.position.set(1.85,0,-1.5); room.add(plant);
plant.add(cyl(0.13,0.1,0.26,M.rug,'pot',24).translateY(0.13));
for (const [n,x,y,z,s] of [['leaf_a',0,0.42,0,1],['leaf_b',0.1,0.34,0.06,0.75],['leaf_c',-0.09,0.36,-0.05,0.8]]) {
  const l = new THREE.Mesh(new THREE.SphereGeometry(0.13,20,14), M.leaf);
  l.name = n; l.position.set(x,y,z); l.scale.set(s,s*1.3,s); plant.add(l);
}
const art = box(0.5,0.66,0.03,M.frame,'wall_art_frame',-2.18,1.6,-0.4); art.rotation.y = Math.PI/2; room.add(art);
const artTex = new THREE.TextureLoader().load('./assets/mfh-tree.png');
artTex.colorSpace = THREE.SRGBColorSpace;
const artMat = new THREE.MeshStandardMaterial({ name:'art_print', color:0xf4f1ea,
  map:artTex, roughness:0.9, transparent:true });
const artIn = new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.3), artMat);
artIn.name = 'wall_art_canvas'; artIn.position.set(-2.126,1.62,-0.4);
artIn.rotation.y = Math.PI/2; room.add(artIn);
const matMat = new THREE.MeshStandardMaterial({ name:'art_mat', color:0xf0ece1, roughness:0.95 });
const artBack = box(0.4,0.55,0.02,matMat,'wall_art_mat',-2.145,1.6,-0.4);
artBack.rotation.y = Math.PI/2; room.add(artBack);

/* ---------- lights (mood) ---------- */
const lampLight = new THREE.PointLight(0xffc078, 6, 5, 2); lampLight.name = 'lamp_light';
lampLight.position.set(0.55,0.88,-1.45); room.add(lampLight);
const moonLight = new THREE.DirectionalLight(0x9fb6ff, 0.55); moonLight.name = 'moon_light';
moonLight.position.set(-1.0,2.6,-3.5); moonLight.target.position.set(-0.6,0.6,-0.4);
room.add(moonLight, moonLight.target);

stage.setObject(room);
// frame on the bed, from inside the room
stage._camera.position.set(1.9, 2.0, 1.6);
stage._controls.target.set(-0.5, 0.95, -0.85);
stage._controls.minDistance = 1.2;
stage._controls.maxDistance = 3.8;
stage._controls.update();
// Boundaries: keep the camera inside the room. The floor is 4.4 x 3.8
// centred on the origin (x -2.2..2.2, z -1.9..1.9) with 2.5 m walls, so the
// camera is confined a touch inside the walls, above the floor, and below
// the ceiling line — it can orbit/zoom/pan but never leaves the room.
stage.setCameraBounds(
  new THREE.Vector3(-2.1, 0.2, -1.8),
  new THREE.Vector3( 2.1, 2.4,  1.8)
);

/* ---------- state ---------- */
const S = { tongue:'floor', lips:'sealed', pos:'back', pillow:3, temp:70, light:'lamp', wind:'screens', dog:'floor' };
const LABEL = {
  tongue:{floor:'Floor of mouth',palate:'Roof of mouth',teeth:'Behind lower teeth',between:'Between the teeth'},
  lips:{sealed:'Sealed',parted:'Parted'},
  pos:{back:'On the back',side:'On the side',front:'Face down'},
  light:{dark:'Dark',dim:'Dim',lamp:'Lamp on'},
  wind:{screens:'Screens',read:'Reading',quiet:'Quiet dark'},
  dog:{none:'Another room',floor:'On the floor',bed:'On the bed'},
};

const $ = (s) => document.querySelector(s);
const runBtn = $('#run'), card = $('#card'), logEl = $('#log'), clockT = $('#clock .t'), clockS = $('#clock .s');
let running = false, best = null, runs = 0;

document.querySelectorAll('.seg').forEach(seg => {
  const key = seg.dataset.key;
  seg.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || running) return;
    S[key] = b.dataset.val; function renderChart(res) {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 362, H = 108, PAD = 46, top = 12, rowH = (H - top - 20) / 4;
  const svg = $('#c-chart');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = '';
  const lanes = ['Awake', 'REM', 'Light', 'Deep'];
  const colors = ['#e77b93', '#c69bdc', '#8fa6dd', '#7fd8b6'];
  lanes.forEach((l, i) => {
    const y = top + i * rowH;
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', PAD); line.setAttribute('x2', W - 6);
    line.setAttribute('y1', y); line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(233,229,242,.09)');
    svg.appendChild(line);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', 6); t.setAttribute('y', y + 3.5);
    t.setAttribute('fill', colors[i]); t.setAttribute('font-size', '9');
    t.setAttribute('font-family', 'JetBrains Mono, monospace');
    t.textContent = l; svg.appendChild(t);
  });
  const n = res.stages.length, step = (W - 6 - PAD) / n;
  const yOf = v => top + [0, 1, 2, 3].indexOf(v) * rowH;
  let d = '';
  res.stages.forEach((v, i) => {
    const x = PAD + i * step, y = yOf(v);
    d += (i === 0 ? `M${x} ${y}` : `L${x} ${y}`) + `L${x + step} ${y}`;
  });
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', d); p.setAttribute('fill', 'none');
  p.setAttribute('stroke', '#f2b26b'); p.setAttribute('stroke-width', '1.8');
  p.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(p);
  ['23:00', '03:00', '07:00'].forEach((lab, i) => {
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', PAD + i * (W - 6 - PAD) / 2);
    t.setAttribute('y', H - 4);
    t.setAttribute('text-anchor', i === 0 ? 'start' : i === 2 ? 'end' : 'middle');
    t.setAttribute('fill', 'rgba(233,229,242,.4)'); t.setAttribute('font-size', '9');
    t.setAttribute('font-family', 'JetBrains Mono, monospace');
    t.textContent = lab; svg.appendChild(t);
  });
  $('#c-wakeups').textContent = res.wakeups;
}

sync();
  });
});
$('#pillow').addEventListener('input', e => { S.pillow = +e.target.value; sync(); });
$('#temp').addEventListener('input', e => { S.temp = +e.target.value; sync(); });
$('#again').addEventListener('click', () => card.classList.remove('on'));
runBtn.addEventListener('click', simulate);

function sync() {
  document.querySelectorAll('.seg').forEach(seg => {
    seg.querySelectorAll('button').forEach(b =>
      b.setAttribute('aria-pressed', String(S[seg.dataset.key] === b.dataset.val)));
  });
  $('#v-tongue').textContent = LABEL.tongue[S.tongue];
  $('#v-lips').textContent = LABEL.lips[S.lips];
  $('#v-pos').textContent = LABEL.pos[S.pos];
  $('#v-light').textContent = LABEL.light[S.light];
  $('#v-wind').textContent = LABEL.wind[S.wind];
  $('#v-dog').textContent = LABEL.dog[S.dog];
  $('#v-pillow').textContent = S.pillow;
  $('#v-temp').textContent = S.temp + '°F';
  applyPose();
  drawDiagram();
}

/* ---------- 3D pose from state ---------- */
function applyPose() {
  const open = S.lips === 'parted';
  mouth.scale.y = open ? 3.4 : 1;
  mouth.position.y = -0.066;
  tongueMesh.visible = open || S.tongue === 'between';
  const tY = { floor:-0.072, teeth:-0.066, palate:-0.048, between:-0.06 }[S.tongue];
  const tZ = { floor:0.10, teeth:0.118, palate:0.112, between:0.128 }[S.tongue];
  tongueMesh.position.set(0, tY, tZ);

  // the head lies ON the pillow: crown toward the headboard, face up / sideways / down
  const front = S.pos === 'front', side = S.pos === 'side';
  headGrp.rotation.x = S.pos === 'front' ? Math.PI / 2 : -Math.PI / 2;
  headGrp.rotation.z = { back: 0, side: -Math.PI * 0.44, front: 0 }[S.pos];
  headGrp.rotation.y = 0;
  headGrp.position.set(S.pos === 'side' ? -0.05 : 0, S.pos === 'front' ? -0.06 : 0, 0.02);

  sleeper.rotation.z = { back: 0, side: 0.1, front: 0 }[S.pos];
  arm.position.set(side ? 0.2 : front ? 0.32 : 0.29, front ? -0.19 : -0.14, side ? 0.05 : front ? 0.3 : 0.16);
  arm.rotation.z = side ? -0.15 : front ? 0.02 : 0.22;
  hand.position.set(side ? 0.13 : front ? 0.31 : 0.24, side ? -0.05 : front ? -0.2 : -0.13,
                    side ? 0.16 : front ? 0.48 : 0.34);
  chest.scale.set(side ? 0.82 : front ? 1.1 : 1, side ? 0.68 : front ? 0.5 : 0.68, side ? 0.78 : 1);
  hips.scale.set(side ? 0.8 : front ? 1.05 : 1, side ? 0.62 : front ? 0.46 : 0.62, 1);
  legs.scale.set(front ? 1.0 : 1.05, front ? 0.44 : 0.55, 1);
  legs.position.set(front ? 0.02 : 0.05, front ? 0.552 : 0.565, front ? 0.72 : 0.68);
  shoulder.scale.set(front ? 1.3 : 1.15, front ? 0.5 : 0.62, front ? 0.8 : 0.9);
  feet.position.set(front ? 0.02 : 0.05, front ? 0.565 : 0.578, front ? 1.0 : 0.94);
  feet.scale.set(1, front ? 0.45 : 0.6, front ? 0.9 : 0.8);

  const ph = 0.09 + S.pillow * 0.028;
  pillow.scale.y = ph / 0.17;
  pillow.position.y = 0.5 + ph / 2;
  sleeper.position.y = 0.62 + ph + 0.055;

  const warm = S.temp >= 72, cold = S.temp <= 61;
  duvet.position.z = warm ? 0.55 : 0.22;
  duvet.scale.z = warm ? 0.7 : 1;
  legs.visible = !warm;

  dog.visible = S.dog !== 'none';
  dogBedCushion.visible = S.dog === 'floor';
  if (S.dog === 'bed') { dog.position.set(-1.0,0.66,0.25); dog.rotation.y = -0.7; dog.scale.setScalar(0.85); }
  else { dog.position.set(-0.15,0,0.45); dog.rotation.y = 0.5; dog.scale.setScalar(1); }

  const lampOn = S.light === 'lamp', dim = S.light === 'dim';
  lampLight.intensity = lampOn ? 6 : dim ? 1.6 : 0;
  M.shade.emissiveIntensity = lampOn ? 0.9 : dim ? 0.3 : 0.02;
}

/* ---------- HUD diagram ---------- */
function drawDiagram() {
  const tg = $('#dg-tongue'), aw = $('#dg-airway'), lp = $('#dg-lips'), sp = $('#dg-soft');
  const shapes = {
    // mid-sagittal tongue mass, tip toward the lips (right)
    floor:   'M126 118 Q136 96 168 100 Q212 104 240 108 Q244 118 232 120 Q180 126 126 118 Z',
    palate:  'M132 112 Q140 86 178 86 Q216 86 242 92 Q246 102 234 106 Q182 114 132 112 Z',
    teeth:   'M130 116 Q142 94 176 96 Q216 98 246 104 Q250 114 238 116 Q184 122 130 116 Z',
    between: 'M128 116 Q140 92 180 92 Q222 92 254 88 Q262 94 252 100 Q200 116 128 116 Z',
  };
  tg.setAttribute('d', shapes[S.tongue]);
  sp.setAttribute('d', S.tongue === 'palate' ? 'M150 84 Q142 94 146 106' : 'M150 84 Q134 98 141 114');
  const gap = { palate:13, teeth:9, floor:5, between:3 }[S.tongue] - (S.lips === 'parted' ? 3 : 0)
            - (S.pos === 'back' ? 3 : 0);
  aw.setAttribute('stroke-width', String(Math.max(3.5, gap)));
  aw.setAttribute('stroke', gap >= 10 ? '#7fd8b6' : gap >= 6 ? '#f2b26b' : '#e77b93');
  lp.setAttribute('d', S.lips === 'sealed'
    ? 'M244 90 Q252 89 256 87'
    : 'M243 82 Q252 81 257 79 M243 97 Q252 96 257 94');
}

/* ---------- breathing / snore animation ---------- */
const zMat = new THREE.MeshBasicMaterial({ name:'sleep_z', color:0xeaeeff,
  transparent:true, opacity:0.85, depthWrite:false });
function zGeometry(w, h, t) {
  const sh = new THREE.Shape();
  sh.moveTo(0, h); sh.lineTo(w, h); sh.lineTo(w, h - t);
  sh.lineTo(0.30 * w, t); sh.lineTo(w, t); sh.lineTo(w, 0);
  sh.lineTo(0, 0); sh.lineTo(0, t); sh.lineTo(0.70 * w, h - t); sh.lineTo(0, h - t);
  sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: 0.008, bevelEnabled: false });
  g.center(); return g;
}
const zGeo = zGeometry(0.16, 0.2, 0.045);
const zs = [];
for (let i = 0; i < 5; i++) {
  const z = new THREE.Mesh(zGeo, zMat.clone());
  z.material.name = 'sleep_z';
  z.name = 'sleep_z_' + i; z.castShadow = false; z.receiveShadow = false;
  sleeper.add(z); zs.push(z);
}
let t0 = performance.now();
function frame(now) {
  const t = (now - t0) / 1000;
  const disturbed = S.lips === 'parted' || S.tongue === 'floor' || S.tongue === 'between';
  const rate = disturbed ? 3.4 : 2.1;
  const b = Math.sin(t * rate);
  chest.scale.y = 1 + b * (disturbed ? 0.20 : 0.11);
  chest.position.y = 0.66 + b * 0.014;
  hips.scale.y = 1 + b * 0.05;
  sleeper.position.z = -0.72 + Math.sin(t * rate * 0.5) * 0.004;

  const speed = disturbed ? 0.42 : 0.26;
  zs.forEach((z, i) => {
    const k = ((t * speed + i / zs.length) % 1);
    const dir = S.pos === 'side' ? [0.55, 0.7, 0.15] : S.pos === 'front' ? [0.2, 0.5, 0.55] : [0.15, 0.9, 0.3];
    z.position.set(0.06 + dir[0] * k + Math.sin(k * 3.2 + i) * 0.09,
                   0.02 + dir[1] * k, 0.1 + dir[2] * k);
    const s2 = (0.45 + k * 1.3) * (disturbed ? 1.25 : 1);
    z.scale.setScalar(s2);
    z.rotation.set(0, 0, Math.sin(k * 2.4 + i) * 0.35);
    if (stage._camera) z.quaternion.copy(stage._camera.quaternion);
    z.material.opacity = 0.9 * Math.min(1, k * 5) * (1 - k * 0.9);
    z.visible = true;
  });

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------- scoring ---------- */
function evaluate() {
  const airwayPen = { palate:0, teeth:12, floor:26, between:36 }[S.tongue]
    + (S.lips === 'parted' ? 22 : 0)
    + { back:20, front:10, side:0 }[S.pos];
  const target = { side:4, back:2, front:1 }[S.pos];
  const neckPen = Math.abs(S.pillow - target) * 8;
  const tempPen = Math.abs(S.temp - 65) * 2.2;
  const lightPen = { dark:0, dim:10, lamp:26 }[S.light];
  const windPen = { quiet:0, read:6, screens:24 }[S.wind];
  const dogPen = { none:4, floor:0, bed:16 }[S.dog];

  const airway = Math.max(0, 100 - airwayPen - neckPen * 0.5);
  const oxygen = Math.max(80, 99 - airwayPen * 0.28);
  const deep = Math.max(0, 100 - airwayPen * 0.7 - tempPen * 0.8 - lightPen * 0.5);
  const rem = Math.max(0, 100 - lightPen - windPen * 0.8 - airwayPen * 0.35);
  const latency = Math.min(95, 8 + windPen * 1.6 + lightPen * 0.9 + tempPen * 0.5 + dogPen * 0.6);
  const restless = Math.min(100, airwayPen * 0.6 + tempPen * 1.1 + neckPen * 0.8 + dogPen * 1.4);

  const score = Math.round(Math.max(0, Math.min(100,
    airway * 0.3 + deep * 0.22 + rem * 0.2 + (100 - latency) * 0.13 + (100 - restless) * 0.15)));

  const events = [];
  if (S.wind === 'screens') events.push([0.06, 'Still wide awake. <b>Lights out was 40 min ago.</b>']);
  if (S.light === 'lamp') events.push([0.12, 'Lamp still burning. Melatonin never rises.']);
  if (S.light === 'dim') events.push([0.12, 'Low light bleeding through the eyelids.']);
  if (S.lips === 'parted') events.push([0.24, 'Mouth falls open. <b>Snoring begins.</b>']);
  if (S.tongue === 'floor') events.push([0.34, 'Tongue slides back. Airway narrows.']);
  if (S.tongue === 'between') events.push([0.34, 'Jaw clenching on the tongue.']);
  if (S.tongue === 'palate' && S.lips === 'sealed') events.push([0.3, 'Quiet nasal breathing. <b>Airway holding open.</b>']);
  if (S.pos === 'back') events.push([0.44, 'Flat on the back — gravity is not helping.']);
  if (S.pos === 'front') events.push([0.44, 'Neck twisted to breathe.']);
  if (Math.abs(S.pillow - target) >= 2) events.push([0.52, 'Neck bent out of line all night.']);
  if (S.temp >= 72) events.push([0.6, 'Too warm. Kicking the duvet off.']);
  if (S.temp <= 61) events.push([0.6, 'Too cold. Curling up, waking briefly.']);
  if (S.temp >= 63 && S.temp <= 67 && S.light === 'dark') events.push([0.66, 'Deep sleep block, undisturbed.']);
  if (S.dog === 'bed') events.push([0.5, 'The dog turns over. <b>Half the duvet is gone.</b>']);
  if (S.dog === 'none') events.push([0.5, 'The dog is scratching at the door.']);
  if (S.dog === 'floor') events.push([0.5, 'The dog sighs and settles on its cushion.']);
  if (airwayPen > 30) events.push([0.78, 'Woken by a dry throat.']);
  if (score >= 92) events.push([0.88, '<b>Nothing woke them.</b>']);
  events.push([0.96, 'First light.']);

  // hypnogram: 0=awake 1=REM 2=light 3=deep, 32 samples across the night
  const stages = [];
  const fragility = (airwayPen + tempPen + neckPen + dogPen * 1.4) / 100;
  for (let i = 0; i < 32; i++) {
    const k = i / 31;
    if (k < latency / 480) { stages.push(0); continue; }
    const cyc = Math.sin((k - latency / 480) * Math.PI * 2 * 4.2);
    const deepBias = (1 - k) * 1.1;
    const remBias = k * 1.2;
    let st;
    if (cyc > 0.3 && deepBias * (deep / 100) > 0.3) st = 3;
    else if (cyc < -0.4 && remBias * (rem / 100) > 0.32) st = 1;
    else st = 2;
    const wake = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
    if (wake < fragility * 0.42) st = 0;
    else if (st === 3 && wake < fragility * 0.8) st = 2;
    stages.push(st);
  }
  const wakeups = stages.reduce((n, v, i) => n + (v === 0 && stages[i-1] > 0 ? 1 : 0), 0);

  // clinical notes — worst offenders first
  const notes = [];
  const add = (sev, head, body) => notes.push({ sev, head, body });
  if (S.lips === 'parted') add(22, 'Mouth breathing all night',
    'The seal broke early. Air bypassed the nose, the throat dried out, and snoring followed.');
  if (S.tongue === 'floor') add(26, 'Tongue resting low and back',
    'With no support at the palate, the tongue fell toward the throat each time the jaw relaxed.');
  if (S.tongue === 'between') add(30, 'Tongue held between the teeth',
    'Jaw tension all night. The bite pressure kept pulling the patient toward lighter sleep.');
  if (S.tongue === 'teeth') add(12, 'Tongue tip parked at the lower teeth',
    'Better than the floor, but the body of the tongue still has nothing holding it forward.');
  if (S.pos === 'back') add(20, 'Supine all night',
    'Lying flat lets gravity pull the soft tissue backward. The airway measured its narrowest here.');
  if (S.pos === 'front') add(10, 'Prone with the neck rotated',
    'Breathing was fine, but the cervical spine stayed twisted for eight hours.');
  if (neckPen >= 16) add(neckPen, S.pillow > target ? 'Pillow too high' : 'Pillow too low',
    'The head sat out of line with the spine, kinking the airway and loading the neck.');
  if (S.temp >= 72) add((S.temp - 70) * 5, 'Room ran warm',
    'Core temperature could not fall on schedule. The duvet came off and sleep stayed shallow.');
  if (S.temp <= 61) add((62 - S.temp) * 5, 'Room ran cold',
    'Repeated brief arousals from cold. The body spent the night curling in rather than settling.');
  if (S.light === 'lamp') add(26, 'Light source left on',
    'Melatonin never rose properly. Sleep onset was delayed and REM was cut short.');
  if (S.light === 'dim') add(10, 'Residual light in the room',
    'Enough light reached the eyelids to blunt melatonin at the start of the night.');
  if (S.wind === 'screens') add(24, 'Screen use right up to lights out',
    'The mind was still active at lights out. That cost the first sleep cycle.');
  if (S.wind === 'read') add(6, 'Reading before bed',
    'A mild delay to sleep onset. Not a significant contributor tonight.');
  if (S.dog === 'bed') add(16, 'Dog sharing the bed',
    'Movement and duvet loss caused several arousals the patient will not remember.');
  if (S.dog === 'none') add(4, 'Dog shut out of the room',
    'Intermittent scratching at the door registered as noise arousals.');
  notes.sort((a, b) => b.sev - a.sev);
  if (!notes.length) add(0, 'No weaknesses found',
    'Airway open, spine neutral, room dark and cool, nothing woke the patient. This is the ceiling.');

  return { score, events, stages, wakeups, notes, bars: [
    ['Airway', Math.round(airway), '%'],
    ['Blood O₂', Math.round(oxygen), '%'],
    ['Deep sleep', Math.round(deep), '%'],
    ['REM', Math.round(rem), '%'],
    ['Fell asleep', Math.round(latency), 'm'],
    ['Restlessness', Math.round(restless), '%'],
  ]};
}

/* ---------- night simulation ---------- */
const NIGHT_MS = 11000;
function simulate() {
  if (running) return;
  running = true; runBtn.disabled = true; logEl.innerHTML = '';
  const res = evaluate();
  const fired = new Set();
  const start = performance.now();
  const skyNight = new THREE.Color(0x1b2a52), skyDawn = new THREE.Color(0xe8a877);

  (function tick(now) {
    const k = Math.min(1, (now - start) / NIGHT_MS);
    const mins = 23 * 60 + k * 8 * 60;
    const hh = String(Math.floor(mins / 60) % 24).padStart(2, '0');
    const mm = String(Math.floor(mins % 60)).padStart(2, '0');
    clockT.textContent = `${hh}:${mm}`;
    clockS.textContent = k < 0.9 ? 'night in progress' : 'waking';

    sky.material.color.copy(skyNight).lerp(skyDawn, Math.max(0, (k - 0.72) / 0.28) ** 1.6);
    moon.position.set(-1.55 + k * 0.8, 1.75 - Math.abs(k - 0.5) * 0.5, WZ - 0.05);
    moon.material.color.setHex(k > 0.85 ? 0xffd9a8 : 0xf6efd8);
    if (S.light !== 'dark') lampLight.intensity *= 0.995;

    res.events.forEach(([at, text], i) => {
      if (k >= at && !fired.has(i)) {
        fired.add(i);
        const h = String(Math.floor((23 * 60 + at * 480) / 60) % 24).padStart(2, '0');
        const m = String(Math.floor((23 * 60 + at * 480) % 60)).padStart(2, '0');
        const d = document.createElement('div');
        d.innerHTML = `${h}:${m} &nbsp; ${text}`;
        logEl.appendChild(d);
        while (logEl.children.length > 6) logEl.removeChild(logEl.firstChild);
      }
    });

    if (k < 1) requestAnimationFrame(tick);
    else finish(res);
  })(start);
}

function finish(res) {
  running = false; runBtn.disabled = false;
  clockT.textContent = '07:00'; clockS.textContent = 'morning';
  applyPose();
  runs++; best = best === null ? res.score : Math.max(best, res.score);
  $('#runs').textContent = runs;
  $('#best').textContent = best;

  $('#c-score').textContent = res.score;
  $('#c-score').style.color = res.score >= 85 ? '#7fd8b6' : res.score >= 60 ? '#f2b26b' : '#e77b93';
  $('#c-verdict').textContent = res.score >= 95 ? 'Perfect night.'
    : res.score >= 85 ? 'Woke up rested. Something still cost you a few points.'
    : res.score >= 65 ? 'Slept, but not well.'
    : res.score >= 40 ? 'Broken sleep. Groggy all morning.'
    : 'Barely slept at all.';
  renderChart(res);
  $('#c-notes').innerHTML = res.notes.slice(0, 4).map(n =>
    `<div class="note"><div class="nh">${n.head}</div><div class="nb">${n.body}</div></div>`).join('');
  $('#c-bars').innerHTML = res.bars.map(([n, v, u]) => {
    const inverted = n === 'Restlessness' || n === 'Fell asleep';
    const pct = inverted ? 100 - Math.min(100, v) : Math.max(0, Math.min(100, (v - (n === 'Blood O₂' ? 80 : 0)) * (n === 'Blood O₂' ? 5 : 1)));
    return `<div class="bar"><span>${n}</span><span class="track"><span class="fill" style="width:${pct}%"></span></span><span class="v">${v}${u}</span></div>`;
  }).join('');
  card.classList.add('on');
}

function renderChart(res) {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 362, H = 108, PAD = 46, top = 12, rowH = (H - top - 20) / 4;
  const svg = $('#c-chart');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = '';
  const lanes = ['Awake', 'REM', 'Light', 'Deep'];
  const colors = ['#e77b93', '#c69bdc', '#8fa6dd', '#7fd8b6'];
  lanes.forEach((l, i) => {
    const y = top + i * rowH;
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', PAD); line.setAttribute('x2', W - 6);
    line.setAttribute('y1', y); line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(233,229,242,.09)');
    svg.appendChild(line);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', 6); t.setAttribute('y', y + 3.5);
    t.setAttribute('fill', colors[i]); t.setAttribute('font-size', '9');
    t.setAttribute('font-family', 'JetBrains Mono, monospace');
    t.textContent = l; svg.appendChild(t);
  });
  const n = res.stages.length, step = (W - 6 - PAD) / n;
  const yOf = v => top + [0, 1, 2, 3].indexOf(v) * rowH;
  let d = '';
  res.stages.forEach((v, i) => {
    const x = PAD + i * step, y = yOf(v);
    d += (i === 0 ? `M${x} ${y}` : `L${x} ${y}`) + `L${x + step} ${y}`;
  });
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', d); p.setAttribute('fill', 'none');
  p.setAttribute('stroke', '#f2b26b'); p.setAttribute('stroke-width', '1.8');
  p.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(p);
  ['23:00', '03:00', '07:00'].forEach((lab, i) => {
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', PAD + i * (W - 6 - PAD) / 2);
    t.setAttribute('y', H - 4);
    t.setAttribute('text-anchor', i === 0 ? 'start' : i === 2 ? 'end' : 'middle');
    t.setAttribute('fill', 'rgba(233,229,242,.4)'); t.setAttribute('font-size', '9');
    t.setAttribute('font-family', 'JetBrains Mono, monospace');
    t.textContent = lab; svg.appendChild(t);
  });
  $('#c-wakeups').textContent = res.wakeups;
}

sync();
