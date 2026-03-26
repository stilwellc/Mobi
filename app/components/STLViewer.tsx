'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useTheme } from './ThemeProvider';

interface STLViewerProps {
  stlPath: string;
  onLoad?: () => void;
}

export default function STLViewer({ stlPath, onLoad }: STLViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isLight = theme === 'light';
    const width = container.clientWidth;
    const height = container.clientHeight || width;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.2 : 1.0;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    controls.enablePan = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;

    // Lighting
    const ambient = new THREE.AmbientLight(isLight ? 0xffffff : 0xcccccc, isLight ? 0.6 : 0.4);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(isLight ? 0xffffff : 0xf0ede8, isLight ? 1.2 : 0.9);
    key.position.set(2, 3, 4);
    scene.add(key);

    const fill = new THREE.DirectionalLight(isLight ? 0x96b8d4 : 0x96b8d4, 0.3);
    fill.position.set(-3, 1, -2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(isLight ? 0xffffff : 0xd4b896, isLight ? 0.4 : 0.3);
    rim.position.set(0, -2, -3);
    scene.add(rim);

    // Load STL
    const loader = new STLLoader();
    loader.load(
      stlPath,
      (geometry) => {
        geometry.computeVertexNormals();
        geometry.center();

        // Scale to fit viewport
        const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position as THREE.BufferAttribute);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;

        const material = new THREE.MeshStandardMaterial({
          color: isLight ? 0x888888 : 0xc0c0c0,
          metalness: 0.15,
          roughness: 0.6,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(scale, scale, scale);
        scene.add(mesh);

        // Position camera
        camera.position.set(3, 2, 3);
        controls.target.set(0, 0, 0);
        controls.update();

        setLoading(false);
        onLoad?.();
      },
      undefined,
      (error) => {
        console.error('Error loading STL:', error);
        setLoading(false);
      }
    );

    // Animation
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || w;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (obj.material instanceof THREE.Material) obj.material.dispose();
        }
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [stlPath, theme, onLoad]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent-blue)', opacity: 0.5 }} />
        </div>
      )}
    </div>
  );
}
