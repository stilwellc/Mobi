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

export default function MobiusStrip({ mobile, theme }: { mobile: boolean; theme: 'dark' | 'light' }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const size = mobile ? 320 : 600;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
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

    // Satin main surface
    const geo = createMobiusGeometry(240, 0.4);
    const surfMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x8a8078 : 0x0c0c0c,
      metalness: 0.85,
      roughness: isLight ? 0.3 : 0.35,
      transparent: true, opacity: 0.55, side: THREE.DoubleSide,
    });
    const surf = new THREE.Mesh(geo, surfMat);

    // One golden emissive edge (LineBasicMaterial is unlit — self-luminous)
    const edgeGeo = createEdgeGeometry(0.4);
    const edgeMat = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: isLight ? 0.45 : 0.4 });
    const edge = new THREE.Line(edgeGeo, edgeMat);

    const group = new THREE.Group();
    group.add(surf, edge);
    group.rotation.x = 0.5;
    group.rotation.z = 0.15;
    scene.add(group);

    let raf = 0, t = 0;
    let inView = true;

    const renderFrame = () => renderer.render(scene, camera);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.0024; // ~20% slower drift
      group.rotation.y = t;
      group.rotation.x = 0.5 + Math.sin(t * 0.4) * 0.1;
      group.rotation.z = 0.15 + Math.cos(t * 0.3) * 0.05;
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
      const s = mobile ? Math.min(320, window.innerWidth - 40) : Math.min(600, window.innerWidth * 0.42);
      renderer.setSize(s, s);
      if (!raf) renderFrame();
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
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
  }, [mobile, theme, reduced]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'absolute', right: mobile ? '50%' : '2%', top: '50%',
        transform: mobile ? 'translate(50%, -50%)' : 'translateY(-50%)',
        zIndex: 0, opacity: 0.85, pointerEvents: 'none',
      }}
    />
  );
}
