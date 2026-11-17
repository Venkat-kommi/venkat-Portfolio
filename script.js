import * as THREE from 'three';

const canvas = document.querySelector('#heroCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 0, 8.5);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

const group = new THREE.Group();
scene.add(group);
const count = 6200;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
const sizes = new Float32Array(count);
const c1 = new THREE.Color('#6d8fff');
const c2 = new THREE.Color('#b18aff');
const c3 = new THREE.Color('#8be9d4');
for (let i = 0; i < count; i++) {
  const u = Math.random() * Math.PI * 2;
  const v = Math.acos(2 * Math.random() - 1);
  const radius = 2.05 + (Math.random() - .5) * .18;
  const x = radius * Math.sin(v) * Math.cos(u);
  const y = radius * Math.sin(v) * Math.sin(u);
  const z = radius * Math.cos(v);
  positions.set([x, y, z], i * 3);
  const mix = Math.random();
  const color = mix < .55 ? c1.clone().lerp(c2, Math.random() * .55) : c2.clone().lerp(c3, Math.random() * .5);
  colors.set([color.r, color.g, color.b], i * 3);
  sizes[i] = Math.random();
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const material = new THREE.PointsMaterial({ size: .018, vertexColors: true, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
const sphere = new THREE.Points(geometry, material);
group.add(sphere);

function makeOrbit(radius, tube, color, opacity, rotation) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius * .34, 0, Math.PI * 2, false, 0);
  const points = curve.getPoints(220).map(p => new THREE.Vector3(p.x, p.y, 0));
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const line = new THREE.LineLoop(geo, mat);
  line.rotation.set(...rotation);
  group.add(line);
  const beadGeo = new THREE.SphereGeometry(tube, 12, 12);
  const beadMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .95 });
  const bead = new THREE.Mesh(beadGeo, beadMat);
  group.add(bead);
  return { line, bead, radius };
}
const orbits = [
  makeOrbit(2.7, .045, '#8db4ff', .38, [.9, .25, -.25]),
  makeOrbit(3.05, .027, '#a98bff', .28, [1.15, -.2, .55]),
  makeOrbit(2.45, .022, '#83e6d2', .32, [.35, .85, .2])
];
const halo = new THREE.Mesh(new THREE.SphereGeometry(2.12, 48, 48), new THREE.MeshBasicMaterial({ color: '#5268bc', wireframe: true, transparent: true, opacity: .055 }));
group.add(halo);
const clock = new THREE.Clock();
let pointerX = 0, pointerY = 0;
window.addEventListener('pointermove', e => { pointerX = (e.clientX / window.innerWidth - .5) * 2; pointerY = (e.clientY / window.innerHeight - .5) * 2; });
function resize() {
  const w = canvas.clientWidth || 500, h = canvas.clientHeight || 500;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas);
resize();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  group.rotation.y += (pointerX * .13 - group.rotation.y) * .012;
  group.rotation.x += (-pointerY * .1 - group.rotation.x) * .012;
  sphere.rotation.y = t * .055;
  sphere.rotation.x = Math.sin(t * .18) * .08;
  halo.rotation.y = -t * .025;
  halo.rotation.z = t * .018;
  orbits.forEach((o, i) => {
    const angle = t * (.28 + i * .09) + i * 2.1;
    const curve = o.line.geometry.attributes.position;
    const p = new THREE.EllipseCurve(0, 0, o.radius, o.radius * .34, angle, angle, false, 0).getPoint(0);
    const v = new THREE.Vector3(p.x, p.y, 0);
    const euler = new THREE.Euler(...o.line.rotation.toArray().slice(0,3));
    v.applyEuler(euler);
    o.bead.position.copy(v);
  });
  renderer.render(scene, camera);
}
animate();

const roles = ['DATA ENGINEER', 'AI / ML DEVELOPER', 'SOFTWARE BUILDER'];
const roleEl = document.querySelector('#roleText');
let roleIndex = 0;
setInterval(() => { roleIndex = (roleIndex + 1) % roles.length; roleEl.animate([{opacity:1, transform:'translateY(0)'},{opacity:0,transform:'translateY(-7px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'ease'}); setTimeout(() => roleEl.textContent = roles[roleIndex], 220); }, 2600);

const menuToggle = document.querySelector('#menuToggle');
const navMenu = document.querySelector('#navMenu');
menuToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));
document.querySelector('#year').textContent = new Date().getFullYear();
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.section-heading,.about-grid,.skills-intro,.skill-card,.work-heading,.project-card,.timeline-item,.contact-kicker,.contact-inner h2,.contact-email').forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });
const glow = document.querySelector('#cursorGlow');
window.addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }, { passive: true });

// Motion layer: scroll progress, ambient starfield, pointer tilt and subtle cursor trail.
const progressBar = document.createElement('div');
progressBar.id = 'scrollProgress';
document.body.appendChild(progressBar);
const ambient = document.createElement('canvas');
ambient.id = 'ambientParticles';
ambient.setAttribute('aria-hidden', 'true');
document.body.prepend(ambient);
const ambientCtx = ambient.getContext('2d');
let ambientW = 0, ambientH = 0, stars = [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function seedStars() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  ambientW = window.innerWidth; ambientH = window.innerHeight;
  ambient.width = Math.floor(ambientW * dpr); ambient.height = Math.floor(ambientH * dpr);
  ambient.style.width = ambientW + 'px'; ambient.style.height = ambientH + 'px';
  ambientCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({length: Math.min(100, Math.floor(ambientW / 12))}, () => ({
    x: Math.random() * ambientW, y: Math.random() * ambientH,
    r: Math.random() * 1.35 + .25, phase: Math.random() * Math.PI * 2,
    speed: Math.random() * .012 + .003, drift: (Math.random() - .5) * .12
  }));
}
seedStars();
window.addEventListener('resize', seedStars, {passive:true});
let lastScroll = 0, scrollTicking = false;
function updateScrollMotion() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  lastScroll = window.scrollY; scrollTicking = false;
}
window.addEventListener('scroll', () => { if (!scrollTicking) { requestAnimationFrame(updateScrollMotion); scrollTicking = true; } }, {passive:true});
updateScrollMotion();
function drawAmbient() {
  if (reducedMotion) return;
  ambientCtx.clearRect(0, 0, ambientW, ambientH);
  const t = performance.now();
  for (const s of stars) {
    const alpha = .18 + (Math.sin(t * s.speed + s.phase) + 1) * .2;
    s.y += s.drift * .15;
    if (s.y > ambientH + 3) s.y = -3;
    ambientCtx.beginPath(); ambientCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ambientCtx.fillStyle = `rgba(170,190,255,${alpha})`; ambientCtx.fill();
  }
  requestAnimationFrame(drawAmbient);
}
drawAmbient();

// Cards respond gently to pointer movement for a tactile 3D feel.
if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--pointer-x', `${x * 100}%`);
      card.style.setProperty('--pointer-y', `${y * 100}%`);
      const tiltX = (0.5 - y) * 5;
      const tiltY = (x - 0.5) * 6;
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
  document.querySelectorAll('.button, .nav-cta').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.045}px,${(e.clientY-r.top-r.height/2)*.08}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
  let trailFrame = 0;
  window.addEventListener('pointermove', e => {
    if (trailFrame++ % 4 !== 0) return;
    const dot = document.createElement('i'); dot.className = 'cursor-dot';
    dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
    document.body.appendChild(dot); dot.addEventListener('animationend', () => dot.remove(), {once:true});
  }, {passive:true});
}
