'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useTheme } from './ThemeProvider';
import { usePrefersReducedMotion } from './hooks';

interface STLViewerProps {
  stlPath: string;
  onLoad?: () => void;
  /** Raw STL bounding-box size in millimeters (x = width, y = depth, z = height; STL is Z-up). */
  onDimensions?: (size: { x: number; y: number; z: number }) => void;
}

export default function STLViewer({ stlPath, onLoad, onDimensions }: STLViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const [loading, setLoading] = useState(true);

  // Keep callbacks out of the effect's dependency graph.
  const onLoadRef = useRef(onLoad);
  const onDimensionsRef = useRef(onDimensions);
  onLoadRef.current = onLoad;
  onDimensionsRef.current = onDimensions;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isLight = theme === 'light';
    const width = container.clientWidth;
    const height = container.clientHeight || width;
    let disposed = false;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2.7, 1.7, 2.7);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.15 : 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !reducedMotion;
    controls.dampingFactor = 0.05;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 1.1;
    controls.enablePan = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 9;

    // Soft studio lighting — warm key, cool fill, gold rim.
    const hemi = new THREE.HemisphereLight(0xf3ead9, 0x2a251d, isLight ? 0.55 : 0.45);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfdf6e8, isLight ? 1.3 : 1.05);
    key.position.set(2.5, 4, 2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 12;
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -3;
    key.shadow.radius = 6;
    key.shadow.bias = -0.0005;
    scene.add(key);

    const fill = new THREE.DirectionalLight(isLight ? 0x8f4149 : 0xc1666b, 0.25);
    fill.position.set(-3, 1.5, -2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(isLight ? 0xa8875d : 0xd4b896, 0.3);
    rim.position.set(0, 2, -3.5);
    scene.add(rim);

    // Ground plane — a quiet disc that receives the shadow, so the object sits somewhere.
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(2.4, 64),
      new THREE.MeshStandardMaterial({
        color: isLight ? 0xede7d8 : 0x171310,
        roughness: 1,
        metalness: 0,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Render control — pause when offscreen, tab hidden, or motion is reduced.
    let animId = 0;
    let running = false;
    let inView = true;

    const renderFrame = () => renderer.render(scene, camera);

    const loop = () => {
      animId = requestAnimationFrame(loop);
      controls.update();
      renderFrame();
    };
    const start = () => {
      if (running || disposed || reducedMotion) return;
      running = true;
      loop();
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(animId);
    };
    const sync = () => {
      if (inView && !document.hidden) start();
      else stop();
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(container);

    const handleVisibility = () => sync();
    document.addEventListener('visibilitychange', handleVisibility);

    // With reduced motion there is no loop — render only when the user moves the camera.
    const handleControlChange = () => {
      if (reducedMotion && !disposed) renderFrame();
    };
    controls.addEventListener('change', handleControlChange);

    // Load STL
    const loader = new STLLoader();
    loader.load(
      stlPath,
      (geometry) => {
        if (disposed) {
          geometry.dispose();
          return;
        }

        // Report real bounding-box dimensions (millimeters, native Z-up frame).
        geometry.computeBoundingBox();
        const rawSize = new THREE.Vector3();
        geometry.boundingBox!.getSize(rawSize);
        onDimensionsRef.current?.({ x: rawSize.x, y: rawSize.y, z: rawSize.z });

        // STL files are Z-up; three.js is Y-up.
        geometry.rotateX(-Math.PI / 2);
        geometry.computeVertexNormals();
        geometry.center();

        geometry.computeBoundingBox();
        const size = new THREE.Vector3();
        geometry.boundingBox!.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;
        const halfHeight = (size.y * scale) / 2;

        // Warm ivory, PLA-like.
        const material = new THREE.MeshStandardMaterial({
          color: isLight ? 0xd9cfbc : 0xe9e0cf,
          metalness: 0.02,
          roughness: 0.55,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.setScalar(scale);
        mesh.position.y = halfHeight; // rest on the ground plane
        mesh.castShadow = true;
        scene.add(mesh);

        controls.target.set(0, halfHeight, 0);
        controls.update();
        renderFrame();

        setLoading(false);
        onLoadRef.current?.();
      },
      undefined,
      (error) => {
        console.error('Error loading STL:', error);
        if (!disposed) setLoading(false);
      }
    );

    // Resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || w;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (!running) renderFrame();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('change', handleControlChange);
      controls.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [stlPath, theme, reducedMotion]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
          }}
        >
          Loading model
        </div>
      )}
    </div>
  );
}
