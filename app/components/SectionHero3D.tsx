'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SectionHero3DProps {
  variant: string;
  mobile: boolean;
  theme: 'dark' | 'light';
  accent: string;
}

function hexToThreeColor(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

// ── Physical: Nested architectural cubes + grid particles ──
function buildPhysical(accent: number, isLight: boolean) {
  const group = new THREE.Group();
  const mat = (size: number) => new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshStandardMaterial({
      color: isLight ? 0x8a8078 : 0x0c0c0c,
      metalness: isLight ? 0.9 : 0.85,
      roughness: isLight ? 0.25 : 0.3,
      transparent: true, opacity: isLight ? 0.4 : 0.35, side: THREE.DoubleSide,
    }),
  );
  const wire = (size: number) => new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: isLight ? 0.12 : 0.08 }),
  );
  const edges = (size: number, op: number) => {
    const geo = new THREE.BoxGeometry(size, size, size);
    const edgeGeo = new THREE.EdgesGeometry(geo);
    return new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: op }));
  };

  const c1 = mat(1.4); const w1 = wire(1.4); const e1 = edges(1.4, isLight ? 0.35 : 0.25);
  const c2 = mat(0.9); const w2 = wire(0.9); const e2 = edges(0.9, isLight ? 0.25 : 0.18);
  const c3 = mat(0.5); const w3 = wire(0.5); const e3 = edges(0.5, isLight ? 0.4 : 0.3);

  const inner = new THREE.Group(); inner.add(c1, w1, e1);
  const mid = new THREE.Group(); mid.add(c2, w2, e2);
  const small = new THREE.Group(); small.add(c3, w3, e3);
  group.add(inner, mid, small);

  // Grid floor particles
  const pCount = 80, pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 3;
    pPos[i * 3 + 1] = -1.2 + Math.random() * 0.1;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 3;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
  group.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: accent, size: 0.015, transparent: true, opacity: isLight ? 0.4 : 0.35, sizeAttenuation: true,
  })));

  group.rotation.x = 0.4; group.rotation.z = 0.2;
  const update = (t: number) => {
    inner.rotation.y = t * 0.5;
    inner.rotation.x = Math.sin(t * 0.3) * 0.15;
    mid.rotation.y = -t * 0.35;
    mid.rotation.z = Math.cos(t * 0.4) * 0.1;
    small.rotation.y = t * 0.7;
    small.rotation.x = Math.cos(t * 0.5) * 0.2;
  };
  return { group, update };
}

// ── Digital: Orbiting torus rings + central sphere + particles ──
function buildDigital(accent: number, isLight: boolean) {
  const group = new THREE.Group();
  const ringMat = new THREE.MeshStandardMaterial({
    color: isLight ? 0x8a8078 : 0x0c0c0c,
    metalness: isLight ? 0.9 : 0.85, roughness: isLight ? 0.25 : 0.3,
    transparent: true, opacity: isLight ? 0.4 : 0.35, side: THREE.DoubleSide,
  });
  const wireMat = new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: isLight ? 0.1 : 0.07 });

  const makeRing = (radius: number, tube: number, rx: number, ry: number) => {
    const g = new THREE.Group();
    const geo = new THREE.TorusGeometry(radius, tube, 16, 80);
    g.add(new THREE.Mesh(geo, ringMat));
    g.add(new THREE.Mesh(geo, wireMat));
    const edgeGeo = new THREE.EdgesGeometry(geo);
    g.add(new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: isLight ? 0.3 : 0.2 })));
    g.rotation.x = rx; g.rotation.y = ry;
    return g;
  };

  const r1 = makeRing(1.0, 0.04, 0, 0);
  const r2 = makeRing(0.75, 0.03, Math.PI / 3, Math.PI / 4);
  const r3 = makeRing(0.5, 0.025, -Math.PI / 4, Math.PI / 2);
  group.add(r1, r2, r3);

  // Central sphere
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 20, 20),
    new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: isLight ? 0.3 : 0.5, transparent: true, opacity: 0.7 }),
  );
  group.add(sphere);

  // Orbiting particles
  const pCount = 100, pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2, phi = Math.random() * Math.PI, r = 0.6 + Math.random() * 0.8;
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: accent, size: 0.012, transparent: true, opacity: isLight ? 0.5 : 0.4, sizeAttenuation: true,
  }));
  group.add(particles);

  group.rotation.x = 0.3;
  const update = (t: number) => {
    r1.rotation.z = t * 0.4;
    r2.rotation.x = Math.PI / 3 + t * 0.3;
    r2.rotation.z = t * 0.2;
    r3.rotation.y = Math.PI / 2 + t * 0.5;
    particles.rotation.y = t * 0.15;
    particles.rotation.x = Math.sin(t * 0.2) * 0.1;
    sphere.scale.setScalar(1 + Math.sin(t * 2) * 0.08);
  };
  return { group, update };
}

// ── Shop: Floating gem/crystal (icosahedron) + sparkle particles ──
function buildShop(accent: number, isLight: boolean) {
  const group = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(0.9, 0);
  const gem = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: isLight ? 0x8a8078 : 0x0c0c0c,
    metalness: isLight ? 0.95 : 0.9, roughness: isLight ? 0.15 : 0.2,
    transparent: true, opacity: isLight ? 0.5 : 0.45, side: THREE.DoubleSide, flatShading: true,
  }));
  const wireGem = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    color: accent, wireframe: true, transparent: true, opacity: isLight ? 0.12 : 0.08,
  }));
  const edgeGeo = new THREE.EdgesGeometry(geo);
  const edgeGem = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({
    color: accent, transparent: true, opacity: isLight ? 0.4 : 0.3,
  }));
  group.add(gem, wireGem, edgeGem);

  // Inner glow sphere
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 16, 16),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: isLight ? 0.06 : 0.04 }),
  );
  group.add(glow);

  // Sparkle particles scattered around
  const pCount = 90, pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2, phi = Math.random() * Math.PI, r = 1.0 + Math.random() * 1.2;
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: accent, size: 0.014, transparent: true, opacity: isLight ? 0.5 : 0.4, sizeAttenuation: true,
  }));
  group.add(particles);

  group.rotation.x = 0.3; group.rotation.z = 0.15;
  const update = (t: number) => {
    gem.rotation.y = t * 0.4;
    gem.rotation.x = 0.3 + Math.sin(t * 0.3) * 0.15;
    wireGem.rotation.y = t * 0.4;
    wireGem.rotation.x = 0.3 + Math.sin(t * 0.3) * 0.15;
    edgeGem.rotation.y = t * 0.4;
    edgeGem.rotation.x = 0.3 + Math.sin(t * 0.3) * 0.15;
    glow.scale.setScalar(1 + Math.sin(t * 1.5) * 0.12);
    particles.rotation.y = t * 0.1;
  };
  return { group, update };
}

// ── Social: Connected node network ──
function buildSocial(accent: number, isLight: boolean) {
  const group = new THREE.Group();
  const nodeMat = new THREE.MeshStandardMaterial({
    color: isLight ? 0x8a8078 : 0x0c0c0c,
    metalness: isLight ? 0.9 : 0.85, roughness: isLight ? 0.25 : 0.3,
    transparent: true, opacity: isLight ? 0.55 : 0.5,
  });
  const nodePositions = [
    new THREE.Vector3(-0.7, 0.5, 0),
    new THREE.Vector3(0.8, 0.3, 0.2),
    new THREE.Vector3(0, -0.6, -0.1),
  ];
  const nodes: THREE.Mesh[] = [];
  nodePositions.forEach(pos => {
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), nodeMat);
    n.position.copy(pos);
    nodes.push(n);
    group.add(n);
    // Wireframe ring around each node
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.01, 8, 40),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: isLight ? 0.15 : 0.1 }),
    );
    ring.position.copy(pos);
    group.add(ring);
  });

  // Connections between nodes
  const lineMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: isLight ? 0.3 : 0.2 });
  for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
      group.add(new THREE.Line(lineGeo, lineMat));
    }
  }

  // Edge glow on nodes
  nodePositions.forEach(pos => {
    const edgeGeo = new THREE.EdgesGeometry(new THREE.SphereGeometry(0.21, 8, 8));
    const edgeLine = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: isLight ? 0.25 : 0.18 }));
    edgeLine.position.copy(pos);
    group.add(edgeLine);
  });

  // Orbiting particles around each node
  const pCount = 90, pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const node = nodePositions[i % 3];
    const theta = Math.random() * Math.PI * 2, r = 0.3 + Math.random() * 0.5;
    pPos[i * 3] = node.x + r * Math.cos(theta);
    pPos[i * 3 + 1] = node.y + (Math.random() - 0.5) * 0.4;
    pPos[i * 3 + 2] = node.z + r * Math.sin(theta);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: accent, size: 0.012, transparent: true, opacity: isLight ? 0.45 : 0.35, sizeAttenuation: true,
  }));
  group.add(particles);

  group.rotation.x = 0.3; group.rotation.z = 0.1;
  const update = (t: number) => {
    nodes.forEach((n, i) => {
      n.position.y = nodePositions[i].y + Math.sin(t * 0.8 + i * 2) * 0.08;
    });
    group.rotation.y = t * 0.15;
    particles.rotation.y = t * 0.2;
  };
  return { group, update };
}

// ── About: Torus knot (trefoil) — echoes the Möbius theme ──
function buildAbout(accent: number, isLight: boolean) {
  const group = new THREE.Group();
  const geo = new THREE.TorusKnotGeometry(0.7, 0.15, 150, 16, 2, 3);
  const surf = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: isLight ? 0x8a8078 : 0x0c0c0c,
    metalness: isLight ? 0.9 : 0.85, roughness: isLight ? 0.25 : 0.3,
    transparent: true, opacity: isLight ? 0.5 : 0.45, side: THREE.DoubleSide,
  }));
  const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    color: accent, wireframe: true, transparent: true, opacity: isLight ? 0.08 : 0.06,
  }));
  const edgeGeo = new THREE.EdgesGeometry(geo, 15);
  const edge = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({
    color: accent, transparent: true, opacity: isLight ? 0.35 : 0.25,
  }));
  group.add(surf, wire, edge);

  // Particle trail
  const pCount = 120, pPos = new Float32Array(pCount * 3);
  const knotCurve = new THREE.TorusKnotGeometry(0.7, 0.15, pCount, 2, 2, 3);
  const knotPositions = knotCurve.getAttribute('position');
  for (let i = 0; i < pCount; i++) {
    const idx = Math.floor(Math.random() * knotPositions.count);
    pPos[i * 3] = knotPositions.getX(idx) + (Math.random() - 0.5) * 0.15;
    pPos[i * 3 + 1] = knotPositions.getY(idx) + (Math.random() - 0.5) * 0.15;
    pPos[i * 3 + 2] = knotPositions.getZ(idx) + (Math.random() - 0.5) * 0.15;
  }
  knotCurve.dispose();
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: accent, size: 0.012, transparent: true, opacity: isLight ? 0.45 : 0.35, sizeAttenuation: true,
  }));
  group.add(particles);

  group.rotation.x = 0.5; group.rotation.z = 0.15;
  const update = (t: number) => {
    group.rotation.y = t * 0.3;
    group.rotation.x = 0.5 + Math.sin(t * 0.4) * 0.1;
    group.rotation.z = 0.15 + Math.cos(t * 0.3) * 0.05;
    particles.rotation.y = t * 0.2;
  };
  return { group, update };
}

const BUILDERS: Record<string, (accent: number, isLight: boolean) => { group: THREE.Group; update: (t: number) => void }> = {
  physical: buildPhysical,
  digital: buildDigital,
  shop: buildShop,
  social: buildSocial,
  about: buildAbout,
};

export default function SectionHero3D({ variant, mobile, theme, accent }: SectionHero3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const builder = BUILDERS[variant];
    if (!builder) return;

    const size = mobile ? 280 : 500;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const isLight = theme === 'light';
    const accentHex = hexToThreeColor(accent);

    scene.add(new THREE.AmbientLight(0xffffff, isLight ? 0.1 : 0.15));
    const kl = new THREE.DirectionalLight(accentHex, isLight ? 0.7 : 0.6); kl.position.set(3, 4, 5); scene.add(kl);
    const fl = new THREE.DirectionalLight(0x96b8d4, isLight ? 0.35 : 0.25); fl.position.set(-3, -1, 3); scene.add(fl);
    const rl = new THREE.DirectionalLight(accentHex, isLight ? 0.45 : 0.35); rl.position.set(-2, 3, -4); scene.add(rl);
    const pl = new THREE.PointLight(accentHex, isLight ? 0.5 : 0.4, 10); pl.position.set(0, 0, 3); scene.add(pl);

    const { group, update } = builder(accentHex, isLight);
    scene.add(group);

    let id: number, t = 0;
    const animate = () => {
      id = requestAnimationFrame(animate);
      t += 0.003;
      update(t);
      pl.position.x = Math.sin(t * 2) * 2;
      pl.position.y = Math.cos(t * 2) * 2;
      renderer.render(scene, camera);
    };
    animate();

    const hr = () => {
      const s = mobile ? Math.min(280, window.innerWidth - 40) : Math.min(500, window.innerWidth * 0.38);
      renderer.setSize(s, s);
    };
    window.addEventListener('resize', hr);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', hr);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [variant, mobile, theme, accent]);

  return <div ref={mountRef} style={{
    position: 'absolute', right: mobile ? '50%' : '2%', top: '50%',
    transform: mobile ? 'translate(50%,-50%)' : 'translateY(-50%)',
    zIndex: 0, opacity: 0.85, pointerEvents: 'none', filter: 'contrast(1.1)',
  }} />;
}
