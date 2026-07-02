'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from './hooks';

function createMobiusGeometry(segments = 240, width = 0.4) {
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const rows = segments, cols = 8;
  for (let i = 0; i <= rows; i++) {
    const u = (i / rows) * Math.PI * 2;
    for (let j = 0; j <= cols; j++) {
      const v = (j / cols - 0.5) * width;
      const cosU = Math.cos(u), sinU = Math.sin(u);
      const cosH = Math.cos(u / 2), sinH = Math.sin(u / 2);
      const r = 1 + v * cosH;
      positions.push(r * cosU, r * sinU, v * sinH);
      uvs.push(i / rows, j / cols);
    }
  }
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
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

// The Mobius strip has exactly one boundary: trace u from 0 to 4pi at fixed v
// and the curve closes on itself. One continuous golden edge, no re-smoothing.
function createEdgeGeometry(width = 0.4, steps = 800) {
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

export default function MobiusStrip({ theme }: { theme: 'dark' | 'light' }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    // Canvas pixel size follows the CSS-sized wrapper — measured after mount,
    // so it never touches server-rendered markup.
    const measure = () => Math.max(1, Math.round(container.clientWidth));
    const size = measure();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // updateStyle=false: CSS keeps the canvas at 100% of the wrapper.
    renderer.setSize(size, size, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const isLight = theme === 'light';
    const gold = isLight ? 0xa8875d : 0xd4b896;
    const ocean = isLight ? 0x4e7396 : 0x96b8d4;

    scene.add(new THREE.AmbientLight(0xffffff, isLight ? 0.1 : 0.15));
    const key = new THREE.DirectionalLight(gold, isLight ? 0.7 : 0.6);
    key.position.set(3, 4, 5);
    const fill = new THREE.DirectionalLight(ocean, isLight ? 0.35 : 0.25);
    fill.position.set(-3, -1, 3);
    const rim = new THREE.DirectionalLight(gold, isLight ? 0.45 : 0.35);
    rim.position.set(-2, 3, -4);
    scene.add(key, fill, rim);

    // Satin main surface — champagne bronze, never cold gray
    const geo = createMobiusGeometry(240, 0.4);
    const surfMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xb49b78 : 0x2e2214,
      metalness: 0.8,
      roughness: isLight ? 0.28 : 0.32,
      transparent: true, opacity: 0.55, side: THREE.DoubleSide,
    });
    const surf = new THREE.Mesh(geo, surfMat);

    // One golden emissive edge (LineBasicMaterial is unlit — self-luminous)
    const edgeGeo = createEdgeGeometry(0.4);
    const edgeMat = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: isLight ? 0.6 : 0.65 });
    const edge = new THREE.Line(edgeGeo, edgeMat);

    const group = new THREE.Group();
    group.add(surf, edge);
    group.rotation.x = 0.5;
    group.rotation.z = 0.15;
    scene.add(group);

    let raf = 0, t = 0;
    let inView = true;

    // The strip acknowledges the visitor: pointer targets lerped into
    // rotation offsets inside the existing loop (max +/-0.05 rad).
    // One window pointermove storing targets only; gated on
    // (pointer: fine) and not-reduced-motion — else zero listeners.
    let offX = 0, offZ = 0, targetX = 0, targetZ = 0;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const onPointer = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = ny * 0.05;
      targetZ = -nx * 0.05;
    };
    if (finePointer && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    const renderFrame = () => renderer.render(scene, camera);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.0024; // ~20% slower drift
      offX += (targetX - offX) * 0.04;
      offZ += (targetZ - offZ) * 0.04;
      group.rotation.y = t;
      group.rotation.x = 0.5 + Math.sin(t * 0.4) * 0.1 + offX;
      group.rotation.z = 0.15 + Math.cos(t * 0.3) * 0.05 + offZ;
      renderFrame();
    };

    const start = () => { if (!raf && !reduced && inView && !document.hidden) tick(); };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    // Pause when offscreen
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else stop();
    });
    io.observe(container);

    // Pause when the tab is hidden
    const onVisibility = () => { if (document.hidden) stop(); else start(); };
    document.addEventListener('visibilitychange', onVisibility);

    // One static frame covers reduced-motion; the loop takes over if allowed
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
      if (finePointer && !reduced) window.removeEventListener('pointermove', onPointer);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      surfMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [theme, reduced]);

  return (
    <>
      <style>{`
        /* Base opacity 0.85 lives on the hero scroll layer (HeroSection),
           which scrubs it to 0 as the strip lifts. Mobile: 0.41 x 0.85 = 0.35. */
        .mobius-wrap{position:absolute;top:50%;right:2%;transform:translateY(-50%);z-index:0;pointer-events:none;width:min(600px,42vw);max-width:100%;aspect-ratio:1/1}
        .mobius-wrap canvas{display:block;width:100%;height:100%}
        @media (max-width: 767px) {
          .mobius-wrap{width:min(70vw,320px);right:8%;top:38%;opacity:0.41}
        }
      `}</style>
      <div ref={mountRef} aria-hidden="true" className="mobius-wrap" />
    </>
  );
}
