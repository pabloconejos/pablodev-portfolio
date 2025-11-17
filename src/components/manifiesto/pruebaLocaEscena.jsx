// Scene.jsx
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import PruebaLocaModel from "./pruebaLocaModel";
import MarqueeStack from "./MarqueeStack";
// "use client" si usas Next.js (app router)

export default function Scene() {
  return (
    <Canvas style={{ backgroundColor: "black", position: "absolute", top: "86dvh"}}>
      <directionalLight intensity={3} position={[0, 3, 2]} />
      <Environment preset="studio" />

      {/* Texto multi-fila */}
      <MarqueeStack />

      {/* Tu malla animada */}
      <PruebaLocaModel />
    </Canvas>
  );
}
