import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const VRView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationId: number | null = null;
    let cube: THREE.Mesh | null = null;
    if (mountRef.current) {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, 400);
      mountRef.current.appendChild(renderer.domElement);
      scene = new THREE.Scene();
      scene.background = new THREE.Color('#e0eafc');
      camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / 400, 0.1, 1000);
      camera.position.z = 5;
      // نموذج افتراضي (مكعب يمثل عقار)
      const geometry = new THREE.BoxGeometry(2, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: '#8ecae6' });
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      // إضاءة
      const light = new THREE.DirectionalLight('#fff', 1);
      light.position.set(5, 5, 5);
      scene.add(light);
      // حركة دوران
      const animate = () => {
        if (cube && scene && camera && renderer) {
          cube.rotation.y += 0.01;
          renderer.render(scene, camera);
          animationId = requestAnimationFrame(animate);
        }
      };
      animate();
    }
    return () => {
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
      if (animationId) cancelAnimationFrame(animationId);
      // تنظيف الذاكرة
      if (scene && cube) {
        scene.remove(cube);
        (cube.geometry as THREE.BufferGeometry).dispose();
        (cube.material as THREE.Material).dispose();
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: 400, borderRadius: 16, margin: '32px 0', background: '#e0eafc' }} />;
};

export default VRView;
