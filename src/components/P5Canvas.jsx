import { useEffect, useRef } from "react";
import p5 from "p5";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Joystick } from "lucide-react";

export default function P5Canvas({ sketchCode, games = [], onChangeSketch }) {
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

  /* ── Empty state / Main Menu ── */
  if (!sketchCode) {
    return (
      <div className="arcade-empty">
        {/* Joystick icon */}
        <span className="arcade-empty-icon" role="img" aria-label="joystick">
          🕹️
        </span>

        {/* Title */}
        <p className="arcade-empty-title glow-cyan">BIENVENIDO A ARCANE NEXUS</p>
        <p className="arcade-empty-sub">Selecciona un juego para comenzar</p>

        {/* ── Centered game selector ── */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              id="menu-game-selector-btn"
              className="arcade-btn-primary mt-4 cursor-pointer flex items-center gap-2 px-8 py-5 text-sm"
            >
              <Joystick className="h-4 w-4" />
              SELECCIONAR JUEGO
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-background text-foreground border border-border min-w-[200px]"
            align="center"
          >
            {games.map((g) => (
              <DropdownMenuItem
                key={g.name}
                id={`menu-game-${g.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="cursor-pointer"
                onClick={() => onChangeSketch(g.sketch, g.name)}
              >
                {g.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        
      </div>
    );
  }

  /* ── Active canvas ── */
  return (
    <div className="arcade-canvas-wrap relative">
      {/* Corner decorators */}
      <span className="canvas-corner tl" aria-hidden="true" />
      <span className="canvas-corner tr" aria-hidden="true" />
      <span className="canvas-corner bl" aria-hidden="true" />
      <span className="canvas-corner br" aria-hidden="true" />

      <div ref={canvasRef} />
    </div>
  );
}
