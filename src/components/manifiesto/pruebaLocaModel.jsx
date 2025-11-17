import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export default function PruebaLocaModel() {
  const { nodes } = useGLTF("/media/cuadrado.glb");
  const { viewport } = useThree();

  const geometry =
    nodes.Torus?.geometry ??
    Object.values(nodes).find((n) => n.isMesh)?.geometry;

  const materialPropsVidrio = {
    color: "#ffffff",
    transmission: 1,
    thickness: 0.3,
    roughness: 0.42,
    ior: 1.1,
    anisotropy: 0.12,
    chromaticAberration: 0.04,
    clearcoat: 0.28,
    clearcoatRoughness: 1,
    distortion: 0.18,
    distortionScale: 0.28,
    attenuationDistance: 0.6,
    attenuationColor: "#FFFFFC",
  };

  // 🔧 Config de 3 vidrios con posición base y parámetros de animación
  const glasses = useMemo(
    () => [
      {
        base: [viewport.width * 0.25, 1.6, -0.2], // arriba derecha
        scale: viewport.width / 3.6,
        bobAmp: 0.12,
        bobSpeed: 0.6,
        circleR: 0.18,
        circleSpeed: 0.35,
      },
      {
        base: [-viewport.width * 0.35, 1.1, -0.3], // arriba izquierda
        scale: viewport.width / 4.8,
        bobAmp: 0.10,
        bobSpeed: 0.7,
        circleR: 0.16,
        circleSpeed: 0.42,
      },
      {
        base: [viewport.width * 0.05, -2.1, -0.1], // abajo derecha
        scale: viewport.width / 4.2,
        bobAmp: 0.14,
        bobSpeed: 0.55,
        circleR: 0.22,
        circleSpeed: 0.32,
      },
    ],
    [viewport.width]
  );

  const meshes = useRef([]);

  // 🌀 Flotación (Y) + órbita suave (X/Z) + wobble de rotación
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const g = glasses[i];
      const phase = i * 0.8; // desfase para que no vayan iguales

      // posiciones animadas
      const y = g.base[1] + Math.sin(t * g.bobSpeed + phase) * g.bobAmp;
      const x = g.base[0] + Math.cos(t * g.circleSpeed + phase) * g.circleR;
      const z = g.base[2] + Math.sin(t * g.circleSpeed + phase) * g.circleR;

      // rotación sutil
      const tiltAmp = 0.05;
      const tiltX = Math.sin(t * g.bobSpeed + phase) * (tiltAmp * 0.6);
      const tiltZ = Math.cos(t * g.bobSpeed + phase) * tiltAmp;

      // aplica
      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.PI / 2 + tiltX, 0, tiltZ);
    });
  });

  return (
    <>
      {glasses.map((g, i) => (
        <mesh
          key={i}
          ref={(el) => (meshes.current[i] = el)}
          geometry={geometry}
          position={g.base}
          scale={g.scale}
          rotation={[Math.PI / 2, 0, 0]}
          renderOrder={2} // encima del texto (que está en z ~ -1.25)
        >
          <MeshTransmissionMaterial {...materialPropsVidrio} />
        </mesh>
      ))}
    </>
  );
}

// ⚠️ Asegúrate de que el preload coincide con lo que cargas arriba
useGLTF.preload("/media/cuadrado.glb");
