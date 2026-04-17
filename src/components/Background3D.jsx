import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import * as TWEEN from '@tweenjs/tween.js';

const TABS_CAMERA_VIEWS = {
  dashboard: { pos: { x: 0, y: 15, z: 30 }, rot: { x: -Math.PI / 6, y: 0, z: 0 } },
  agents: { pos: { x: -25, y: 10, z: 20 }, rot: { x: -Math.PI / 8, y: -Math.PI / 8, z: 0 } },
  audit: { pos: { x: 25, y: 20, z: 15 }, rot: { x: -Math.PI / 4, y: Math.PI / 8, z: 0 } },
  settings: { pos: { x: 0, y: 40, z: 5 }, rot: { x: -Math.PI / 2, y: 0, z: 0 } },
};

export function Background3D({ activeTab }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const planeRef = useRef(null);
  const particlesRef = useRef(null);
  
  // Animation variables
  const clock = new THREE.Clock();
  const noise2D = createNoise2D();

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');
    scene.fog = new THREE.FogExp2('#050505', 0.02);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(TABS_CAMERA_VIEWS.dashboard.pos.x, TABS_CAMERA_VIEWS.dashboard.pos.y, TABS_CAMERA_VIEWS.dashboard.pos.z);
    camera.rotation.set(TABS_CAMERA_VIEWS.dashboard.rot.x, TABS_CAMERA_VIEWS.dashboard.rot.y, TABS_CAMERA_VIEWS.dashboard.rot.z);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Setup Terrain
    const geometry = new THREE.PlaneGeometry(200, 100, 80, 40);
    geometry.rotateX(-Math.PI / 2); // Lay flat
    
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x8b5cf6, // Violet
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    
    // Emerald secondary wireframe for a layered look
    const material2 = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });

    const plane = new THREE.Mesh(geometry, material);
    const plane2 = new THREE.Mesh(geometry.clone(), material2);
    plane2.position.y -= 2;

    scene.add(plane);
    scene.add(plane2);
    planeRef.current = { mesh1: plane, mesh2: plane2, geometry: geometry };

    // 3. Setup Particles (Data nodes)
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 400;
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 150;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.2,
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.position.y = 5;
    scene.add(particles);
    particlesRef.current = particles;

    // 4. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 5. Animation Loop
    let animationId;
    const animate = (time) => {
      animationId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Update Terrain Noise
      const positionAttribute = geometry.attributes.position;
      const vertex = new THREE.Vector3();
      
      for ( let i = 0; i < positionAttribute.count; i ++ ) {
          vertex.fromBufferAttribute( positionAttribute, i );
          // Only modify Y, since we rotated the plane X to lay flat
          // vertex original X, Z
          const noise = noise2D(vertex.x * 0.05, vertex.z * 0.05 + elapsedTime * 0.2);
          positionAttribute.setY(i, noise * 4);
      }
      positionAttribute.needsUpdate = true;

      // Update secondary plane
      const p2Attr = plane2.geometry.attributes.position;
      for ( let i = 0; i < p2Attr.count; i ++ ) {
          vertex.fromBufferAttribute( p2Attr, i );
          const noise = noise2D(vertex.x * 0.03, vertex.z * 0.03 + elapsedTime * 0.1);
          p2Attr.setY(i, noise * 6);
      }
      p2Attr.needsUpdate = true;
      
      // Animate particles
      particles.rotation.y = elapsedTime * 0.02;

      TWEEN.update(time);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      material2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Camera Target when Tab Changes
  useEffect(() => {
    if (!cameraRef.current) return;
    
    const target = TABS_CAMERA_VIEWS[activeTab] || TABS_CAMERA_VIEWS.dashboard;
    
    // Tween Position
    new TWEEN.Tween(cameraRef.current.position)
        .to(target.pos, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

    // Tween Rotation
    new TWEEN.Tween(cameraRef.current.rotation)
        .to(target.rot, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

  }, [activeTab]);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)' }}
    />
  );
}
