import InfiniteMarqueeText from "./InfiniteMarqueeText";
import { useThree } from "@react-three/fiber";

export default function MarqueeStack() {
  const { viewport } = useThree();

  // 🔠 letras más grandes
  const scale = viewport.width / 7.5; // 4.2–4.6 = grande; 3.8 = enorme

  // ↕️ separación vertical responsive (distribuye las 6 filas por el alto)
  // deja un 12–16% de margen arriba/abajo para que “respire”
  const marginFactor = 0.14;                      // sube/baja si quieres más/menos margen
  const usableH = viewport.height * (1 - marginFactor);
  const rowsCount = 6;                            // si cambias nº de filas, actualízalo o usa rows.length
  const rowGap = usableH / (rowsCount - 1);      // distancia uniforme entre filas

const rows = [
  { text: "PABLO CONEJOS CHIRIVELLA", base:  1, speed: 0.008 },
  { text: "WEB DEVELOPER",           base: -1, speed: 0.006 },
  { text: "BACKEND DEVELOPER",       base:  1, speed: 0.005 },
  { text: "DATA BASE ARCHITECT",     base: -1, speed: 0.007 },
  { text: "BASED IN SPAIN",          base:  1, speed: 0.004 },
  { text: "WORKING AT LOGIFRUIT",    base: -1, speed: 0.006 },
];



  const mid = (rows.length - 1) / 2;

  return (
    <>
      {rows.map((r, i) => (
        <InfiniteMarqueeText
          key={i}
          text={r.text}
          y={(mid - i) * rowGap} // centrado vertical con gap uniforme
          z={-1.25}
          base={r.base}
          speed={r.speed}
          gap={0.8}               // espacio horizontal entre repeticiones
          letterSpacing={0}
          emissive="#ffffff"
          emissiveIntensity={8}
          scale={scale}           // 👈 fuerza la escala grande
        />
      ))}
    </>
  );
}
