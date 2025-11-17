// InfiniteMarqueeText.jsx
import { Text } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function InfiniteMarqueeText({
  text,
  y = 0,
  z = -1.25,
  scale,                // si no lo pasas, se usa viewport.width / 4.8
  speed = 0.008,        // factor de velocidad (px de scroll → unidades X)
  base = 1,             // 1 = sentido “left”, -1 = “right”
  gap = 0.5,            // espacio extra entre repeticiones
  emissive = "#ffffff",
  emissiveIntensity = 6,
  color = "white",
  letterSpacing = -10,
  font = "/fonts/ArchivoBlack.ttf",
  weight = "bold",
}) {
  const group = useRef(null);
  const textRef = useRef(null);
  const lastYRef = useRef(0);
  const offsetRef = useRef(0);     // acumulador del desplazamiento
  const [segment, setSegment] = useState(1);

  const { viewport } = useThree();
  const textScale = scale ?? viewport.width / 6.8;

  // 📏 Mide el ancho real del texto (incluye escala) y añade margen (gap)
  const onSync = useCallback(() => {
    if (!textRef.current) return;
    const geom = textRef.current.geometry;
    if (geom) {
      geom.computeBoundingBox();
      const bb = geom.boundingBox;
      if (bb) {
        const rawWidth = bb.max.x - bb.min.x;   // ancho local
        const worldWidth = rawWidth * textScale; // ancho en mundo
        setSegment(Math.max(0.001, worldWidth + gap + 0.1));
      }
    }
  }, [gap, textScale]);

  // Inicializa lastY (por si entras con scroll ya hecho)
  useEffect(() => {
    lastYRef.current = typeof window !== "undefined" ? (window.scrollY || 0) : 0;
  }, []);

  // Copias necesarias para cubrir ancho
  const copies = useMemo(() => {
    const needed = Math.ceil((viewport.width * 2) / Math.max(segment, 0.001)) + 2;
    return Math.max(6, needed);
  }, [segment, viewport.width]);

  useFrame(() => {
    const y = typeof window !== "undefined" ? (window.scrollY || 0) : 0;
    const delta = y - lastYRef.current;     // + bajando, - subiendo
    lastYRef.current = y;

    // acumula desplazamiento según delta, velocidad y base (dirección de fila)
    offsetRef.current += delta * speed * base;

    if (group.current && segment > 0) {
      // normaliza a [0, segment)
      const off = ((offsetRef.current % segment) + segment) % segment;
      group.current.position.x = -off;
    }
  });

  const baseProps = {
    scale: textScale,
    letterSpacing,
    font,
    fontWeight: weight,
    anchorX: "left",
    renderOrder: 0,
  };

  return (
    <group ref={group} position={[0, y, z]}>
      {/* instancia principal (sirve para medir y dibujar) */}
      <Text ref={textRef} {...baseProps} onSync={onSync}>
        {text}
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          toneMapped={false}
          depthTest={false}
        />
      </Text>

      {/* clones laterales para el loop infinito */}
      {Array.from({ length: copies }).map((_, i) => {
        const k = i - Math.floor(copies / 2);
        if (k === 0) return null;
        return (
          <Text key={i} position={[k * segment, 0, 0]} {...baseProps}>
            {text}
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
              toneMapped={false}
              depthTest={false}
            />
          </Text>
        );
      })}
    </group>
  );
}
