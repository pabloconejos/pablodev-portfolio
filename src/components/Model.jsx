import { useGLTF, Text, MeshTransmissionMaterial } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Model() {
  const mesh = useRef();
  const { nodes } = useGLTF("/media/developerTypoThinner.glb");
  const { viewport } = useThree();

  const geometry = nodes.Torus
    ? nodes.Torus.geometry
    : Object.values(nodes).find((n) => n.isMesh)?.geometry;

  // 🔹 Valores fijos (antes controlados por Leva)
  const speed = 0.8;
  const bobAmplitude = 0.12;
  const circleRadius = 0.12;
  const circleSpeed = 0.4;
  const tiltAmplitude = 0.05;

  const basePos = useRef([-1, 0, 0]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const y = basePos.current[1] + Math.sin(t * speed) * bobAmplitude;
    const x = basePos.current[0] + Math.cos(t * circleSpeed) * circleRadius;
    const z = 0 + Math.sin(t * circleSpeed) * circleRadius;

    const tiltX = Math.sin(t * speed) * (tiltAmplitude * 0.6);
    const tiltZ = Math.cos(t * speed) * tiltAmplitude;

    if (mesh.current) {
      mesh.current.position.set(x, y, z);
      mesh.current.rotation.set(Math.PI / 2 + tiltX, 0, tiltZ);
    }
  });

  // 🔹 Material con valores fijos
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

  return (
    <>
      <Text
        font="/fonts/ArchivoBlack.ttf"
        scale={viewport.width / 4.8}
        fontWeight={"bold"}
        position={[0, 0, -1.25]}
        letterSpacing={-0.05}
        renderOrder={0}
      >
        pablo
        <meshStandardMaterial
          color="white"
          emissive="#d4ff00ff"
          emissiveIntensity={100}
          toneMapped={false}
        />
      </Text>

      <mesh
        ref={mesh}
        scale={viewport.width / 3}
        geometry={geometry}
        position={basePos.current}
        renderOrder={1}
      >
        <MeshTransmissionMaterial {...materialPropsVidrio} />
        {/* <meshPhysicalMaterial
        transmission={1}
        thickness={0.1}
        attenuationColor="red"
        attenuationDistance={15}
        roughness={1}
        ior={1.5}
      /> */}
      </mesh>
    </>
  );
}

useGLTF.preload("/media/developerTypoThinner.glb");



// const materialPropsVidrio = useControls("glass", { color: "#ffffff", transmission: { value: 1, min: 0, max: 1, step: 0.01 }, thickness: { value: 0.3, min: 0, max: 5, step: 0.1 }, roughness: { value: 0.42, min: 0, max: 1, step: 0.01 }, ior: { value: 1.1, min: 1, max: 2.5, step: 0.05 }, anisotropy: { value: 0.12, min: 0, max: 1, step: 0.01 }, chromaticAberration: { value: 0.04, min: 0, max: 0.5, step: 0.01 }, clearcoat: { value: 0.28, min: 0, max: 1, step: 0.01 }, clearcoatRoughness: { value: 1, min: 0, max: 1, step: 0.01 }, distortion: { value: 0.18, min: 0, max: 1, step: 0.01 }, distortionScale: { value: 0.28, min: 0, max: 1, step: 0.01 }, attenuationDistance: { value: 0.6, min: 0, max: 5, step: 0.1 }, attenuationColor: "#FFFFFC", });º