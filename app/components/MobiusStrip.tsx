'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from './hooks';

/**
 * The Möbius engine — the hero's focal object, built as a statement
 * of both the brand and the craft:
 *
 * SURFACE (custom GLSL): champagne satin with a fresnel gold rim and
 * a luminous pulse that travels the strip forever — one band, one
 * side, one boundary, demonstrated rather than described. The mesh
 * is liquid: pointer raycasts hit the real surface and spawn damped
 * ripple waves in the vertex shader, so the strip answers touch like
 * disturbed metal.
 *
 * MATTER (GPU particles): thousands of motes sampled on the surface,
 * breathing along their normals, twinkling out of phase, repelled by
 * the cursor, and dispersing skyward as you scroll away.
 *
 * All motion is shader-side off two uniforms (time, scroll); the CPU
 * does one raycast every other frame and a rotation lerp. Pauses
 * offscreen and on hidden tabs; reduced motion renders one static
 * frame with zero listeners; full disposal on unmount.
 */

const SURF_VERT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uHit;        // last pointer hit, object space
  uniform float uHitTime;   // seconds at impact
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  varying float vBandGlow;

  void main() {
    vUv = uv;
    vec3 p = position;
    vec3 n = normal;

    // Liquid response: damped rings radiating from the touch point.
    float age = uTime - uHitTime;
    if (age < 3.5) {
      float d = distance(p, uHit);
      float wave = sin(d * 16.0 - age * 7.0)
                 * exp(-d * 3.0)
                 * exp(-age * 1.6)
                 * 0.055;
      p += n * wave;
    }

    // Breathing — the surface is alive even untouched.
    p += n * sin(vUv.x * 18.849556 + uTime * 0.7) * 0.004;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * n);
    vView = normalize(-mv.xyz);

    // Traveling pulse position along u (shared with fragment for glow)
    float bu = fract(vUv.x - uTime * 0.045);
    float band = smoothstep(0.06, 0.0, min(bu, 1.0 - bu));
    vBandGlow = band;

    gl_Position = projectionMatrix * mv;
  }
`;

const SURF_FRAG = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uGold;
  uniform vec3 uOcean;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  varying float vBandGlow;

  void main() {
    // Double-sided: flip the normal on back faces
    vec3 N = gl_FrontFacing ? vNormal : -vNormal;
    vec3 V = normalize(vView);

    // Two baked directional lights: warm key, cool fill
    vec3 keyDir = normalize(vec3(0.5, 0.7, 0.8));
    vec3 fillDir = normalize(vec3(-0.6, -0.2, 0.5));
    float keyD = max(dot(N, keyDir), 0.0);
    float fillD = max(dot(N, fillDir), 0.0);

    vec3 col = uBase * (0.22 + keyD * 0.85) + uOcean * fillD * 0.10;

    // Specular streak from the key — satin, not chrome
    vec3 H = normalize(keyDir + V);
    col += uGold * pow(max(dot(N, H), 0.0), 22.0) * 0.35;

    // Fresnel gold rim — the golden-hour edge light
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col += uGold * fres * 0.55;

    // The traveler: a luminous pulse endlessly walking the one side
    col += uGold * vBandGlow * 1.35;

    float alpha = uOpacity * (0.72 + vBandGlow * 0.28 + fres * 0.15);
    gl_FragColor = vec4(col, min(alpha, 1.0));
  }
`;

const PART_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;    // 0..1 hero scroll progress
  uniform vec3 uMouse;      // pointer in object space
  uniform float uMouseOn;   // 1 when pointer is near the scene
  uniform float uPixel;     // device pixel ratio scale
  attribute vec3 aNormal;
  attribute float aPhase;
  attribute float aSize;
  varying float vAlpha;

  void main() {
    vec3 p = position;

    // Breathe along the surface normal, each mote out of phase
    p += aNormal * sin(uTime * 0.6 + aPhase * 6.2831) * 0.035;

    // Flee the cursor
    vec3 toM = p - uMouse;
    float r = length(toM);
    p += normalize(toM + 0.0001) * smoothstep(0.6, 0.0, r) * 0.38 * uMouseOn;

    // Scroll: the matter releases — up and outward, each at its own rate
    p += aNormal * uScroll * (0.5 + aPhase * 1.1);
    p.y += uScroll * (0.8 + aPhase * 1.4);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float twinkle = 0.30 + 0.70 * pow(sin(uTime * 1.25 + aPhase * 43.0) * 0.5 + 0.5, 2.0);
    vAlpha = twinkle * (1.0 - uScroll);
    gl_PointSize = aSize * uPixel * (11.0 / -mv.z);
  }
`;

const PART_FRAG = /* glsl */ `
  uniform vec3 uGold;
  uniform vec3 uOcean;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.05, d);
    // warm core, cool haze at the fringe — whisper-level: thousands stack
    vec3 col = mix(uOcean, uGold, soft);
    gl_FragColor = vec4(col, soft * vAlpha * 0.13);
  }
`;

function createMobiusGeometry(segments = 400, width = 0.4, cols = 16) {
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = (i / segments) * Math.PI * 2;
    for (let j = 0; j <= cols; j++) {
      const v = (j / cols - 0.5) * width;
      const cosU = Math.cos(u), sinU = Math.sin(u);
      const cosH = Math.cos(u / 2), sinH = Math.sin(u / 2);
      const r = 1 + v * cosH;
      positions.push(r * cosU, r * sinU, v * sinH);
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

// One boundary: u runs 0..4pi before the edge closes on itself.
function createEdgeGeometry(width = 0.4, steps = 900) {
  const pts: THREE.Vector3[] = [];
  const v = width / 2;
  for (let i = 0; i <= steps; i++) {
    const u = (i / steps) * Math.PI * 4;
    const cU = Math.cos(u), sU = Math.sin(u), cH = Math.cos(u / 2), sH = Math.sin(u / 2);
    const r = 1 + v * cH;
    pts.push(new THREE.Vector3(r * cU, r * sU, v * sH));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

// Motes sampled on the surface, each carrying its normal + phase + size
function createParticles(count: number, width = 0.4) {
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const size = new Float32Array(count);
  const n = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = (Math.random() - 0.5) * width;
    const cosU = Math.cos(u), sinU = Math.sin(u);
    const cosH = Math.cos(u / 2), sinH = Math.sin(u / 2);
    const r = 1 + v * cosH;
    pos[i * 3] = r * cosU; pos[i * 3 + 1] = r * sinU; pos[i * 3 + 2] = v * sinH;
    // analytic-ish normal via cross of parameter tangents
    const du = new THREE.Vector3(
      -r * sinU - (v / 2) * sinH * cosU,
      r * cosU - (v / 2) * sinH * sinU,
      (v / 2) * cosH
    );
    const dv = new THREE.Vector3(cosH * cosU, cosH * sinU, sinH);
    n.crossVectors(du, dv).normalize();
    nor[i * 3] = n.x; nor[i * 3 + 1] = n.y; nor[i * 3 + 2] = n.z;
    phase[i] = Math.random();
    size[i] = 0.5 + Math.random() * 1.1;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aNormal', new THREE.BufferAttribute(nor, 3));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
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
    const ocean = new THREE.Color(isLight ? 0x4e7396 : 0x96b8d4);
    const base = new THREE.Color(isLight ? 0xb49b78 : 0x2e2214);

    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const PARTICLES = reduced ? 0 : mobile ? 5000 : 14000;

    // — Surface —
    const geo = createMobiusGeometry(400, 0.4, 16);
    const surfUniforms = {
      uTime: { value: 0 },
      uHit: { value: new THREE.Vector3(99, 99, 99) },
      uHitTime: { value: -10 },
      uBase: { value: base },
      uGold: { value: gold },
      uOcean: { value: ocean },
      uOpacity: { value: isLight ? 0.62 : 0.7 },
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

    // — Edge —
    const edgeGeo = createEdgeGeometry(0.4);
    const edgeMat = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: isLight ? 0.7 : 0.85 });
    const edge = new THREE.Line(edgeGeo, edgeMat);

    // — Matter —
    let partGeo: THREE.BufferGeometry | null = null;
    let partMat: THREE.ShaderMaterial | null = null;
    const partUniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 99) },
      uMouseOn: { value: 0 },
      uPixel: { value: pixelRatio },
      uGold: { value: gold },
      uOcean: { value: ocean },
    };
    const group = new THREE.Group();
    group.add(surf, edge);
    if (PARTICLES > 0) {
      partGeo = createParticles(PARTICLES);
      partMat = new THREE.ShaderMaterial({
        vertexShader: PART_VERT,
        fragmentShader: PART_FRAG,
        uniforms: partUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      group.add(new THREE.Points(partGeo, partMat));
    }
    group.rotation.x = 0.5;
    group.rotation.z = 0.15;
    scene.add(group);

    let raf = 0, t = 0, frame = 0;
    let inView = true;
    let lastNow = performance.now();

    // Pointer: rotation lerp (existing gesture) + raycast for touch/repel
    let offX = 0, offZ = 0, targetX = 0, targetZ = 0;
    let ndcX = 99, ndcY = 99, wantRay = false;
    const raycaster = new THREE.Raycaster();
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const onPointer = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = ny * 0.05;
      targetZ = -nx * 0.05;
      // NDC relative to the canvas for the raycast
      const r = container.getBoundingClientRect();
      ndcX = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndcY = -(((e.clientY - r.top) / r.height) * 2 - 1);
      wantRay = ndcX >= -1.2 && ndcX <= 1.2 && ndcY >= -1.2 && ndcY <= 1.2;
    };
    if (finePointer && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });

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

      surfUniforms.uTime.value = t;
      partUniforms.uTime.value = t;
      partUniforms.uScroll.value = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);

      // Raycast every other frame: the strip answers touch
      if (wantRay && frame % 2 === 0) {
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
        const hit = raycaster.intersectObject(surf, false)[0];
        if (hit) {
          const local = surf.worldToLocal(hit.point.clone());
          partUniforms.uMouse.value.copy(local);
          partUniforms.uMouseOn.value = 1;
          // fresh ripple only if the last one has settled a little
          if (t - surfUniforms.uHitTime.value > 0.45) {
            surfUniforms.uHit.value.copy(local);
            surfUniforms.uHitTime.value = t;
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

    renderFrame(); // static frame for reduced motion / first paint
    start();

    const onResize = () => {
      const s = measure();
      renderer.setSize(s, s, false);
      if (!raf) renderFrame();
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      if (finePointer && !reduced) window.removeEventListener('pointermove', onPointer);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      geo.dispose(); surfMat.dispose();
      edgeGeo.dispose(); edgeMat.dispose();
      if (partGeo) partGeo.dispose();
      if (partMat) partMat.dispose();
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
          .mobius-wrap{width:min(88vw,420px);right:-16%;top:42%;opacity:0.5}
        }
      `}</style>
      <div ref={mountRef} aria-hidden="true" className="mobius-wrap" />
    </>
  );
}
