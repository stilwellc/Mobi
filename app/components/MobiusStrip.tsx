'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from './hooks';

/**
 * The Möbius engine, at the limit. Entirely custom GLSL:
 *
 * SURFACE — satin champagne under a procedural golden-hour sky
 * (reflection sampled from a sunset gradient that exists only in
 * math), carrying two counter-traveling pulses: the gold Traveler,
 * which is a true moving light source illuminating the surface as
 * it walks the one side, and a quieter wine pulse running the
 * other way — software and matter passing through each other twice
 * per lap. The mesh is liquid: cursor raycasts spawn damped ripple
 * waves, clicks detonate deep shockwaves, and the surface REMEMBERS
 * — a six-point trail of fading light follows where you have been.
 * Scrolling away dissolves the object pixel-by-pixel into nothing.
 *
 * BOUNDARY — the strip's single edge is wrapped in an additive glow
 * tube: the site's Horizon line, in three dimensions.
 *
 * MATTER — thousands of motes sampled on the surface (analytic
 * normals), breathing, twinkling, fleeing the cursor, blasted by
 * shockwaves with damped recoil, released skyward on scroll. A
 * second, slower dust field gives the scene atmospheric depth.
 *
 * All motion is GPU-side off a handful of uniforms; the CPU does
 * one raycast every other frame and a rotation lerp. 60fps
 * measured; reduced motion renders one static frame with zero
 * listeners; full disposal; offscreen/hidden pause.
 */

const TRAIL = 6;

// The birth sweep plays once per page load — not again on theme toggles,
// which remount the whole engine.
let bornOnce = false;

const SURF_VERT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uHit;
  uniform float uHitTime;
  uniform vec3 uBurst;
  uniform float uBurstTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vTan;

  void main() {
    vUv = uv;
    vec3 p = position;
    vec3 n = normal;

    // Analytic tangent along u — the satin's grain direction
    float uu = vUv.x * 6.2831853;
    float vv = (vUv.y - 0.5) * 0.4;
    float cU = cos(uu); float sU = sin(uu);
    float cH = cos(uu * 0.5); float sH = sin(uu * 0.5);
    float rr = 1.0 + vv * cH;
    vTan = normalize(normalMatrix * vec3(
      -rr * sU - 0.5 * vv * sH * cU,
       rr * cU - 0.5 * vv * sH * sU,
       0.5 * vv * cH));

    // Touch: damped rings radiating from the hover point
    float age = uTime - uHitTime;
    if (age < 3.5) {
      p += n * sin(distance(p, uHit) * 16.0 - age * 7.0)
             * exp(-distance(p, uHit) * 3.0)
             * exp(-age * 1.6) * 0.05;
    }

    // Shockwave: deeper, slower rings from a click
    float bAge = uTime - uBurstTime;
    if (bAge < 5.0) {
      float bd = distance(p, uBurst);
      p += n * sin(bd * 9.0 - bAge * 5.2)
             * exp(-bd * 1.6)
             * exp(-bAge * 1.1) * 0.14;
    }

    // Breathing
    p += n * sin(vUv.x * 18.849556 + uTime * 0.7) * 0.004;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * n);
    vView = normalize(-mv.xyz);
    vPos = p;
    gl_Position = projectionMatrix * mv;
  }
`;

const SURF_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uGold;
  uniform vec3 uWine;
  uniform float uOpacity;
  uniform float uScroll;
  uniform vec3 uTravel;              // the gold pulse, object space
  uniform vec3 uTrail[${TRAIL}];     // where you have been
  uniform float uTrailT[${TRAIL}];
  uniform float uLight;              // theme: 1 = light
  uniform float uBirth;              // 0 -> 1: the strip writes itself in
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vTan;

  float hash(vec2 q) {
    return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453);
  }

  // The sky that exists only in math: deep ground -> amber horizon -> pale zenith
  vec3 sky(vec3 dir) {
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 ground = mix(vec3(0.05, 0.035, 0.02), vec3(0.93, 0.89, 0.82), uLight);
    vec3 horizon = mix(vec3(0.55, 0.36, 0.16), vec3(0.86, 0.68, 0.42), uLight);
    vec3 zenith = mix(vec3(0.10, 0.09, 0.13), vec3(0.97, 0.95, 0.90), uLight);
    vec3 c = mix(ground, horizon, smoothstep(0.0, 0.45, h));
    return mix(c, zenith, smoothstep(0.45, 1.0, h));
  }

  void main() {
    // Scroll dissolve: the object surrenders to dust, pixel by pixel
    if (hash(floor(vUv * vec2(720.0, 48.0))) < uScroll * 1.15 - 0.05) discard;

    // Birth: the surface writes itself in along u behind a glowing
    // frontier — the logo's dash pulse, performed by the object itself.
    float birthEdge = uBirth * 1.08;
    if (vUv.x > birthEdge + (hash(vUv * 371.0) - 0.5) * 0.03) discard;

    vec3 N = gl_FrontFacing ? vNormal : -vNormal;
    vec3 V = normalize(vView);

    vec3 keyDir = normalize(vec3(0.5, 0.7, 0.8));
    float keyD = max(dot(N, keyDir), 0.0);
    vec3 col = uBase * (0.20 + keyD * 0.70);

    // Golden-hour environment reflection on the satin
    vec3 R = reflect(-V, N);
    col += sky(R) * 0.34;

    // Specular streak
    vec3 H = normalize(keyDir + V);
    col += uGold * pow(max(dot(N, H), 0.0), 24.0) * 0.30;

    // Anisotropic sheen: spun metal glints across its grain, not along it
    float th = dot(normalize(vTan), H);
    col += uGold * pow(max(1.0 - th * th, 0.0), 14.0) * keyD * 0.22;

    // Fresnel rim
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col += uGold * fres * 0.45;

    // THE TRAVELER — a comet now: sharp head, decaying tail, and a
    // true moving light on the surface
    float bu = fract(vUv.x - uTime * 0.045);
    float band = smoothstep(0.02, 0.0, bu) + exp(-(1.0 - bu) * 16.0) * 0.85;
    band = min(band, 1.0);
    col += uGold * band * 1.25;
    float tl = length(vPos - uTravel);
    col += uGold * (0.55 / (1.0 + tl * tl * 9.0));

    // The counter-pulse — wine, opposite direction, quieter
    float ou = fract(vUv.x + uTime * 0.03 + 0.5);
    float oband = smoothstep(0.035, 0.0, min(ou, 1.0 - ou));
    col += uWine * oband * 0.55;

    // The strip remembers: fading lights where the cursor has been
    for (int i = 0; i < ${TRAIL}; i++) {
      float mem = exp(-(uTime - uTrailT[i]) * 1.3);
      float md = length(vPos - uTrail[i]);
      col += uGold * exp(-md * 14.0) * mem * 0.65;
    }

    // The writing head: a hot gold frontier that cools as birth completes
    col += uGold * smoothstep(0.07, 0.0, birthEdge - vUv.x) * (1.0 - uBirth) * 2.2;

    float alpha = uOpacity * (0.72 + band * 0.28 + fres * 0.15);
    gl_FragColor = vec4(col, min(alpha, 1.0));
  }
`;

const EDGE_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const EDGE_FRAG = /* glsl */ `
  uniform vec3 uGold;
  uniform float uScroll;
  uniform float uBirth;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    // soft-core glow: brightest looking through the tube's center.
    // The edge ignites only once the surface has finished writing itself.
    float core = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
    gl_FragColor = vec4(uGold, core * 0.55 * (1.0 - uScroll) * smoothstep(0.8, 1.0, uBirth));
  }
`;

const PART_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uMouse;
  uniform float uMouseOn;
  uniform vec3 uBurst;
  uniform float uBurstTime;
  uniform float uPixel;
  uniform float uBirth;
  attribute float aU0;    // start angle on the strip
  attribute float aV;     // lane across the width
  attribute float aLift;  // ride height above the surface
  attribute float aSpeed; // angular speed along the current
  attribute float aDir;   // +1 gold current, -1 wine counter-current
  attribute float aPhase;
  attribute float aSize;
  varying float vAlpha;
  varying float vDir;

  void main() {
    // ADVECTION ON A ONE-SIDED SURFACE. The Mobius identity
    // pos(u + 2pi, v) == pos(u, -v) means a mote that completes a lap
    // must flip lanes to stay on the surface — so every particle
    // genuinely crosses to the other face, forever. The whole surface
    // is evaluated analytically here, per mote, per frame.
    float total = aU0 + uTime * aSpeed * aDir;
    float lap = floor(total / 6.2831853);
    float u = total - lap * 6.2831853;
    float flip = 1.0 - 2.0 * mod(lap, 2.0);
    float v = aV * flip;

    float cU = cos(u); float sU = sin(u);
    float cH = cos(u * 0.5); float sH = sin(u * 0.5);
    float r = 1.0 + v * cH;
    vec3 p = vec3(r * cU, r * sU, v * sH);

    // analytic normal from the parameter tangents
    vec3 du = vec3(-r * sU - 0.5 * v * sH * cU, r * cU - 0.5 * v * sH * sU, 0.5 * v * cH);
    vec3 dv = vec3(cH * cU, cH * sU, sH);
    vec3 n = normalize(cross(du, dv));

    // ride above the current with a gentle bob
    p += n * (aLift + sin(uTime * 0.9 + aPhase * 6.2831) * 0.012);

    // flee the cursor
    vec3 toM = p - uMouse;
    p += normalize(toM + 0.0001) * smoothstep(0.6, 0.0, length(toM)) * 0.38 * uMouseOn;

    // shockwave: blasted outward, damped recoil home
    float bAge = uTime - uBurstTime;
    if (bAge < 4.0) {
      vec3 toB = p - uBurst;
      float kick = exp(-bAge * 2.1) * sin(min(bAge * 5.0, 1.5708))
                 * smoothstep(1.6, 0.0, length(toB)) * (0.5 + aPhase * 0.9);
      p += normalize(toB + 0.0001) * kick;
    }

    // scroll: the matter releases
    p += n * uScroll * (0.5 + aPhase * 1.1);
    p.y += uScroll * (0.8 + aPhase * 1.4);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.30 + 0.70 * pow(sin(uTime * 1.25 + aPhase * 43.0) * 0.5 + 0.5, 2.0);
    // matter gathers as the surface finishes forming, each mote on its own beat
    vAlpha = twinkle * (1.0 - uScroll) * smoothstep(0.35 + aPhase * 0.4, 1.0, uBirth + aPhase * 0.25);
    vDir = aDir;
    gl_PointSize = aSize * uPixel * (11.0 / -mv.z);
  }
`;

const PART_FRAG = /* glsl */ `
  uniform vec3 uGold;
  uniform vec3 uWine;
  varying float vAlpha;
  varying float vDir;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.05, d);
    vec3 stream = vDir > 0.0 ? uGold : uWine;
    gl_FragColor = vec4(mix(stream * 0.55, stream, soft), soft * vAlpha * 0.14);
  }
`;

const DUST_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPixel;
  uniform float uBirth;
  attribute float aPhase;
  varying float vA;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.05 + aPhase * 6.2831) * 0.35;
    p.y += cos(uTime * 0.04 + aPhase * 12.566) * 0.28;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vA = (0.35 + 0.65 * sin(uTime * 0.5 + aPhase * 40.0)) * smoothstep(0.5, 1.0, uBirth);
    gl_PointSize = uPixel * (6.5 / -mv.z);
  }
`;

const DUST_FRAG = /* glsl */ `
  uniform vec3 uGold;
  varying float vA;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uGold, smoothstep(0.5, 0.1, d) * vA * 0.05);
  }
`;

function mobiusPoint(u: number, v: number, out: THREE.Vector3) {
  const cosU = Math.cos(u), sinU = Math.sin(u);
  const cosH = Math.cos(u / 2), sinH = Math.sin(u / 2);
  const r = 1 + v * cosH;
  return out.set(r * cosU, r * sinU, v * sinH);
}

function createMobiusGeometry(segments = 400, width = 0.4, cols = 16) {
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const p = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const u = (i / segments) * Math.PI * 2;
    for (let j = 0; j <= cols; j++) {
      const v = (j / cols - 0.5) * width;
      mobiusPoint(u, v, p);
      positions.push(p.x, p.y, p.z);
      uvs.push(i / segments, j / cols);
    }
  }
  for (let i = 0; i < segments; i++) for (let j = 0; j < cols; j++) {
    const a = i * (cols + 1) + j, b = a + cols + 1, c = a + 1, d = b + 1;
    indices.push(a, b, c, c, b, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// The single boundary as a closed curve (u: 0..4pi)
function edgeCurve(width = 0.4, steps = 700) {
  const pts: THREE.Vector3[] = [];
  const v = width / 2;
  const p = new THREE.Vector3();
  for (let i = 0; i < steps; i++) {
    const u = (i / steps) * Math.PI * 4;
    // parameterize directly (mobiusPoint uses u/2 twist internally)
    const cU = Math.cos(u), sU = Math.sin(u), cH = Math.cos(u / 2), sH = Math.sin(u / 2);
    const r = 1 + v * cH;
    pts.push(new THREE.Vector3(r * cU, r * sU, v * sH));
  }
  return new THREE.CatmullRomCurve3(pts, true);
}

function createParticles(count: number, width = 0.4) {
  // The currents: everything but the seed lives in the vertex shader.
  const u0 = new Float32Array(count);
  const v = new Float32Array(count);
  const lift = new Float32Array(count);
  const speed = new Float32Array(count);
  const dir = new Float32Array(count);
  const phase = new Float32Array(count);
  const size = new Float32Array(count);
  // position attribute is required by three; the shader ignores it
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    u0[i] = Math.random() * Math.PI * 2;
    v[i] = (Math.random() - 0.5) * width * 0.94;
    lift[i] = 0.006 + Math.pow(Math.random(), 2) * 0.055;
    speed[i] = 0.16 + Math.random() * 0.55;
    dir[i] = Math.random() < 0.78 ? 1 : -1;
    phase[i] = Math.random();
    size[i] = 0.5 + Math.random() * 1.2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aU0', new THREE.BufferAttribute(u0, 1));
  geo.setAttribute('aV', new THREE.BufferAttribute(v, 1));
  geo.setAttribute('aLift', new THREE.BufferAttribute(lift, 1));
  geo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
  geo.setAttribute('aDir', new THREE.BufferAttribute(dir, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  // shader computes true positions; keep culling honest with a generous sphere
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 4);
  return geo;
}

function createDust(count: number) {
  const pos = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // spherical shell around the scene
    const r = 1.9 + Math.random() * 2.2;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
    pos[i * 3 + 2] = r * Math.cos(ph) * 0.6 - 0.5;
    phase[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  return geo;
}

export default function MobiusStrip({ theme }: { theme: 'dark' | 'light' }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const measure = () => Math.max(1, Math.round(container.clientWidth));
    const size = measure();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size, false);
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const isLight = theme === 'light';
    const gold = new THREE.Color(isLight ? 0xa8875d : 0xd4b896);
    const wine = new THREE.Color(isLight ? 0x8f4149 : 0xc1666b);
    const base = new THREE.Color(isLight ? 0xb49b78 : 0x2e2214);

    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const PARTICLES = reduced ? 0 : mobile ? 8000 : 20000;
    const DUST = reduced ? 0 : mobile ? 900 : 2400;

    // One shared birth clock across surface, edge, matter, and dust.
    // Plays once per page load; theme remounts skip straight to formed.
    const birthU = { value: reduced || bornOnce ? 1 : 0 };
    const birthStart = performance.now();

    // — Surface —
    const geo = createMobiusGeometry(400, 0.4, 16);
    const trailPts = Array.from({ length: TRAIL }, () => new THREE.Vector3(99, 99, 99));
    const trailTs = new Float32Array(TRAIL).fill(-30);
    const surfUniforms = {
      uTime: { value: 0 },
      uHit: { value: new THREE.Vector3(99, 99, 99) },
      uHitTime: { value: -10 },
      uBurst: { value: new THREE.Vector3(99, 99, 99) },
      uBurstTime: { value: -10 },
      uTravel: { value: new THREE.Vector3() },
      uTrail: { value: trailPts },
      uTrailT: { value: trailTs },
      uBase: { value: base },
      uGold: { value: gold },
      uWine: { value: wine },
      uOpacity: { value: isLight ? 0.62 : 0.7 },
      uScroll: { value: 0 },
      uLight: { value: isLight ? 1 : 0 },
      uBirth: birthU,
    };
    const surfMat = new THREE.ShaderMaterial({
      vertexShader: SURF_VERT,
      fragmentShader: SURF_FRAG,
      uniforms: surfUniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const surf = new THREE.Mesh(geo, surfMat);

    // — Boundary glow tube —
    const tubeGeo = new THREE.TubeGeometry(edgeCurve(0.4), 500, 0.008, 6, true);
    const edgeUniforms = { uGold: { value: gold }, uScroll: { value: 0 }, uBirth: birthU };
    const tubeMat = new THREE.ShaderMaterial({
      vertexShader: EDGE_VERT,
      fragmentShader: EDGE_FRAG,
      uniforms: edgeUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);

    // — Matter —
    const partUniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 99) },
      uMouseOn: { value: 0 },
      uBurst: { value: new THREE.Vector3(99, 99, 99) },
      uBurstTime: { value: -10 },
      uPixel: { value: pixelRatio },
      uGold: { value: gold },
      uWine: { value: wine },
      uBirth: birthU,
    };
    let partGeo: THREE.BufferGeometry | null = null;
    let partMat: THREE.ShaderMaterial | null = null;
    const group = new THREE.Group();
    group.add(surf, tube);
    if (PARTICLES > 0) {
      partGeo = createParticles(PARTICLES);
      partMat = new THREE.ShaderMaterial({
        vertexShader: PART_VERT, fragmentShader: PART_FRAG,
        uniforms: partUniforms, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      group.add(new THREE.Points(partGeo, partMat));
    }
    group.rotation.x = 0.5;
    group.rotation.z = 0.15;
    scene.add(group);

    // — Ambient dust (scene space, counter-slow) —
    let dustGeo: THREE.BufferGeometry | null = null;
    let dustMat: THREE.ShaderMaterial | null = null;
    const dustUniforms = { uTime: { value: 0 }, uPixel: { value: pixelRatio }, uGold: { value: gold }, uBirth: birthU };
    if (DUST > 0) {
      dustGeo = createDust(DUST);
      dustMat = new THREE.ShaderMaterial({
        vertexShader: DUST_VERT, fragmentShader: DUST_FRAG,
        uniforms: dustUniforms, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      scene.add(new THREE.Points(dustGeo, dustMat));
    }

    let raf = 0, t = 0, frame = 0;
    let inView = true;
    let lastNow = performance.now();
    let trailIdx = 0, lastTrailT = -1;

    let offX = 0, offZ = 0, targetX = 0, targetZ = 0;
    let ndcX = 99, ndcY = 99, wantRay = false;
    const raycaster = new THREE.Raycaster();
    const travelVec = new THREE.Vector3();

    const toNdc = (clientX: number, clientY: number) => {
      const r = container.getBoundingClientRect();
      ndcX = ((clientX - r.left) / r.width) * 2 - 1;
      ndcY = -(((clientY - r.top) / r.height) * 2 - 1);
      wantRay = ndcX >= -1.2 && ndcX <= 1.2 && ndcY >= -1.2 && ndcY <= 1.2;
    };
    const onPointer = (e: PointerEvent) => {
      targetX = ((e.clientY / window.innerHeight) * 2 - 1) * 0.05;
      targetZ = -((e.clientX / window.innerWidth) * 2 - 1) * 0.05;
      toNdc(e.clientX, e.clientY);
    };
    const onDown = (e: PointerEvent) => {
      toNdc(e.clientX, e.clientY);
      if (!wantRay) return;
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      const hit = raycaster.intersectObject(surf, false)[0];
      if (hit) {
        const local = surf.worldToLocal(hit.point.clone());
        surfUniforms.uBurst.value.copy(local);
        surfUniforms.uBurstTime.value = t;
        partUniforms.uBurst.value.copy(local);
        partUniforms.uBurstTime.value = t;
      }
    };
    // Touch is a first-class citizen: drag leaves the ember trail,
    // tap detonates. Only reduced motion opts out entirely.
    if (!reduced) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
    }

    const renderFrame = () => renderer.render(scene, camera);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      t += dt * 0.55;
      frame++;

      offX += (targetX - offX) * 0.04;
      offZ += (targetZ - offZ) * 0.04;
      group.rotation.y = t * 0.44;
      group.rotation.x = 0.5 + Math.sin(t * 0.22) * 0.1 + offX;
      group.rotation.z = 0.15 + Math.cos(t * 0.165) * 0.05 + offZ;

      // Birth: 2.4s ease-out sweep, once per page load
      if (birthU.value < 1) {
        const bx = Math.min((now - birthStart) / 2400, 1);
        birthU.value = 1 - Math.pow(1 - bx, 3);
        if (bx >= 1) bornOnce = true;
      }

      const scroll = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
      surfUniforms.uTime.value = t;
      surfUniforms.uScroll.value = scroll;
      partUniforms.uTime.value = t;
      partUniforms.uScroll.value = scroll;
      edgeUniforms.uScroll.value = scroll;
      dustUniforms.uTime.value = t;

      // The Traveler's position in object space (band u = fract(t*0.045))
      mobiusPoint(((t * 0.045) % 1) * Math.PI * 2, 0, travelVec);
      surfUniforms.uTravel.value.copy(travelVec);

      if (wantRay && frame % 2 === 0) {
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
        const hit = raycaster.intersectObject(surf, false)[0];
        if (hit) {
          const local = surf.worldToLocal(hit.point.clone());
          partUniforms.uMouse.value.copy(local);
          partUniforms.uMouseOn.value = 1;
          if (t - surfUniforms.uHitTime.value > 0.45) {
            surfUniforms.uHit.value.copy(local);
            surfUniforms.uHitTime.value = t;
          }
          // the memory trail: a new ember at most every 140ms of engine time
          if (t - lastTrailT > 0.14) {
            trailPts[trailIdx].copy(local);
            trailTs[trailIdx] = t;
            trailIdx = (trailIdx + 1) % TRAIL;
            lastTrailT = t;
          }
        } else {
          partUniforms.uMouseOn.value *= 0.92;
        }
      }

      renderFrame();
    };

    const start = () => { if (!raf && !reduced && inView && !document.hidden) { lastNow = performance.now(); tick(); } };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else stop();
    });
    io.observe(container);

    const onVisibility = () => { if (document.hidden) stop(); else start(); };
    document.addEventListener('visibilitychange', onVisibility);

    renderFrame();
    start();

    const onResize = () => {
      const s = measure();
      renderer.setSize(s, s, false);
      if (!raf) renderFrame();
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      if (!reduced) {
        window.removeEventListener('pointermove', onPointer);
        window.removeEventListener('pointerdown', onDown);
      }
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      geo.dispose(); surfMat.dispose();
      tubeGeo.dispose(); tubeMat.dispose();
      if (partGeo) partGeo.dispose();
      if (partMat) partMat.dispose();
      if (dustGeo) dustGeo.dispose();
      if (dustMat) dustMat.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [theme, reduced]);

  return (
    <>
      <style>{`
        /* The focal point. Full presence (opacity lives on the hero scroll
           layer, which scrubs to 0 as the strip lifts). Bleeds off the
           right edge — the section overflow crops it with intent. */
        .mobius-wrap{position:absolute;top:50%;right:-7%;transform:translateY(-50%);z-index:0;pointer-events:none;width:min(880px,58vw);aspect-ratio:1/1}
        .mobius-wrap canvas{display:block;width:100%;height:100%}
        @media (max-width: 767px) {
          /* Mobile owns the strip too: it crowns the top of the screen at
             near-full presence; the headline anchors the lower third. */
          .mobius-wrap{width:min(118vw,560px);right:-24%;top:28%;opacity:0.92}
        }
      `}</style>
      <div ref={mountRef} aria-hidden="true" className="mobius-wrap" />
    </>
  );
}
