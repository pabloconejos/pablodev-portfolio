import React, { useRef, useMemo } from "react";
import { useGLTF, Text, MeshTransmissionMaterial, Center } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";

export default function Model() {
  const group = useRef();
  const { nodes } = useGLTF("/media/developerTypoThinner.glb");
  const { viewport, size } = useThree();

  const geometry =
    nodes.Torus?.geometry ??
    Object.values(nodes).find((n) => n.isMesh)?.geometry;

  // 🔹 breakpoints
  const isMobile = size.width < 640;
  const isTablet = size.width >= 640 && size.width < 1024;

  // 🔹 offset vertical del vidrio respecto al texto (mantenemos relación que te gusta en portátil)
  const glassYOffset = -0.05;

  const {
    textScale,
    textPosition,
    meshScale,
    baseOffset,
    circleRadius,
    bobAmplitude,
  } = useMemo(() => {
    if (isMobile) {
      const textY = 0.25; // posición vertical del texto en móvil
      return {
        // texto un poco más grande en móvil, pero sin pasarse
        textScale: viewport.width / 4.3 + 0.18,
        textPosition: [0, textY, -1.25],
        meshScale: viewport.width / 2.2,
        baseOffset: [0, textY + glassYOffset, 0], // 👈 vidrio ligado al texto
        circleRadius: 0.06,
        bobAmplitude: 0.08,
      };
    }

    if (isTablet) {
      const textY = 0.12;
      return {
        textScale: viewport.width / 4.6,
        textPosition: [0, textY, -1.25],
        meshScale: viewport.width / 2.6,
        baseOffset: [0, textY + glassYOffset, 0],
        circleRadius: 0.09,
        bobAmplitude: 0.1,
      };
    }

    // Desktop / portátil (la relación aquí ya te gustaba)
    const textY = 0;
    return {
      textScale: viewport.width / 4.8,
      textPosition: [0, textY, -1.25],
      meshScale: viewport.width / 3,
      baseOffset: [0, textY + glassYOffset, 0],
      circleRadius: 0.12,
      bobAmplitude: 0.12,
    };
  }, [isMobile, isTablet, viewport.width]);

  // 🔹 animación sobre el grupo
  const speed = 0.8;
  const circleSpeed = 0.4;
  const tiltAmplitude = 0.05;

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.getElapsedTime();

    const y = baseOffset[1] + Math.sin(t * speed) * bobAmplitude;
    const x = baseOffset[0] + Math.cos(t * circleSpeed) * circleRadius;
    const z = baseOffset[2] + Math.sin(t * circleSpeed) * circleRadius;

    const tiltX = Math.sin(t * speed) * (tiltAmplitude * 0.6);
    const tiltZ = Math.cos(t * speed) * tiltAmplitude;

    group.current.position.set(x, y, z);
    group.current.rotation.set(Math.PI / 2 + tiltX, 0, tiltZ);
  });

  // 🔹 material vidrio
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
        fontWeight="bold"
        scale={textScale}
        position={textPosition}
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

      {/* grupo animado + modelo centrado */}
      <group ref={group} renderOrder={1}>
        <Center>
          <mesh geometry={geometry} scale={meshScale}>
            <MeshTransmissionMaterial {...materialPropsVidrio} />
          </mesh>
        </Center>
      </group>
    </>
  );
}

useGLTF.preload("/media/developerTypoThinner.glb");
