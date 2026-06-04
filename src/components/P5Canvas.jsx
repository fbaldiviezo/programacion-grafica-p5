import { useEffect, useRef } from "react";
import p5 from "p5";

export default function P5Canvas({ sketchCode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || typeof sketchCode !== "function") return;

    const sketchContenedor = (p) => {
      sketchCode(p);
    };

    const myP5 = new p5(sketchContenedor, canvasRef.current);

    return () => {
      myP5.remove();
    };
  }, [sketchCode]);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700 shadow-inner">
      <div ref={canvasRef} />
    </div>
  );
}
