'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function createMobiusGeometry(segments = 200, width = 0.35) {
  const positions: number[] = [], normals: number[] = [], uvs: number[] = [], indices: number[] = [];
  const rows = segments, cols = 8;
  for (let i = 0; i <= rows; i++) {
    const u = (i / rows) * Math.PI * 2;
    for (let j = 0; j <= cols; j++) {
      const v = (j / cols - 0.5) * width;
      const cosU = Math.cos(u), sinU = Math.sin(u);
      const cosH = Math.cos(u / 2), sinH = Math.sin(u / 2);
      const r = 1 + v * cosH;
      positions.push(r * cosU, r * sinU, v * sinH);
      const nx = cosU * cosH, ny = sinU * cosH, nz = sinH;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      normals.push(nx / len, ny / len, nz / len);
      uvs.push(i / rows, j / cols);
    }
  }
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const a = i * (cols + 1) + j, b = a + cols + 1, c = a + 1, d = b + 1;
    indices.push(a, b, c, c, b, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export default function MobiusStrip({ mobile, theme }: { mobile: boolean; theme: 'dark' | 'light' }) {
  const mountRef = useRef<HTMLDivElement>(null);

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
    scene.add(new THREE.AmbientLight(0xffffff, isLight ? 0.1 : 0.15));
    const kl = new THREE.DirectionalLight(0xd4b896, isLight ? 0.7 : 0.6); kl.position.set(3, 4, 5); scene.add(kl);
    const fl = new THREE.DirectionalLight(0x96b8d4, isLight ? 0.35 : 0.25); fl.position.set(-3, -1, 3); scene.add(fl);
    const rl = new THREE.DirectionalLight(0xd4b896, isLight ? 0.45 : 0.35); rl.position.set(-2, 3, -4); scene.add(rl);
    const pl = new THREE.PointLight(0xd4b896, isLight ? 0.5 : 0.4, 10); pl.position.set(0, 0, 3); scene.add(pl);

    const geo = createMobiusGeometry(240, 0.4);
    const surf = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: isLight ? 0x8a8078 : 0x0c0c0c,
      metalness: isLight ? 0.9 : 0.85,
      roughness: isLight ? 0.25 : 0.3,
      transparent: true, opacity: isLight ? 0.55 : 0.55, side: THREE.DoubleSide,
    }));
    const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: isLight ? 0xb89a78 : 0xd4b896, wireframe: true, transparent: true, opacity: isLight ? 0.08 : 0.07, side: THREE.DoubleSide,
    }));

    const makeEdge = (v: number, color: number, op: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 400; i++) {
        const u = (i / 400) * Math.PI * 2;
        const cU = Math.cos(u), sU = Math.sin(u), cH = Math.cos(u / 2), sH = Math.sin(u / 2);
        const r = 1 + v * cH;
        pts.push(new THREE.Vector3(r * cU, r * sU, v * sH));
      }
      const curve = new THREE.CatmullRomCurve3(pts, true);
      return new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(500)),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: op }),
      );
    };
    const e1 = makeEdge(0.2, isLight ? 0xb89a78 : 0xd4b896, isLight ? 0.4 : 0.35);
    const e2 = makeEdge(-0.2, isLight ? 0x7a9ab8 : 0x96b8d4, isLight ? 0.25 : 0.18);

    const pCount = 120, pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const u = Math.random() * Math.PI * 2, v = (Math.random() - 0.5) * 0.4, sp = (Math.random() - 0.5) * 0.15;
      const cU = Math.cos(u), sU = Math.sin(u), cH = Math.cos(u / 2), sH = Math.sin(u / 2), r = 1 + v * cH;
      pPos[i * 3] = r * cU + sp; pPos[i * 3 + 1] = r * sU + sp; pPos[i * 3 + 2] = v * sH + sp;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: isLight ? 0xb89a78 : 0xd4b896, size: 0.012, transparent: true, opacity: isLight ? 0.45 : 0.4, sizeAttenuation: true,
    }));

    const group = new THREE.Group();
    group.add(surf, wire, e1, e2, particles);
    group.rotation.x = 0.5; group.rotation.z = 0.15;
    scene.add(group);

    let id: number, t = 0;
    const animate = () => {
      id = requestAnimationFrame(animate);
      t += 0.003;
      group.rotation.y = t;
      group.rotation.x = 0.5 + Math.sin(t * 0.4) * 0.1;
      group.rotation.z = 0.15 + Math.cos(t * 0.3) * 0.05;
      pl.position.x = Math.sin(t * 2) * 2; pl.position.y = Math.cos(t * 2) * 2;
      particles.rotation.y = t * 0.3;
      renderer.render(scene, camera);
    };
    animate();

    const hr = () => {
      const s = mobile ? Math.min(320, window.innerWidth - 40) : Math.min(600, window.innerWidth * 0.42);
      renderer.setSize(s, s);
    };
    window.addEventListener('resize', hr);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', hr);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [mobile, theme]);

  return <div ref={mountRef} style={{
    position: 'absolute', right: mobile ? '50%' : '2%', top: '50%',
    transform: mobile ? 'translate(50%,-50%)' : 'translateY(-50%)',
    zIndex: 0, opacity: 0.85, pointerEvents: 'none', filter: 'contrast(1.1)',
  }} />;
}
