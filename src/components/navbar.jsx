import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Gamepad2, ChevronLeft } from "lucide-react";
import { useTheme } from "@/components/theme-provider"

import { pongSketch }     from "@/components/sketchs/pongSketch";
import { snakeSketch }    from "@/components/sketchs/snakeSketch";
import { breakoutSketch } from "@/components/sketchs/breakoutSketch";

const GAMES = [
    { label: "Pong Classic",      sketch: pongSketch,     name: "Pong Classic" },
    { label: "Neon Snake",        sketch: snakeSketch,     name: "Neon Snake" },
    { label: "Galactic Breakout", sketch: breakoutSketch,  name: "Galactic Breakout" },
];

export default function Navbar({ activeName, onChangeSketch, onBack }) {
    const { setTheme } = useTheme()

    return (
        <header className="arcade-navbar sticky top-0 z-20 px-4 py-3 transition-all duration-300">
            <div className="mx-auto flex items-center justify-between gap-4 px-6">

                {/* ── Brand ── */}
                <div className="flex items-center gap-3">
                    <Gamepad2 className="h-5 w-5 text-primary dark:drop-shadow-[0_0_8px_oklch(0.85_0.22_195/80%)]" />
                    <h1 className="arcade-brand text-foreground">
                        PROGRAMACIÓN GRÁFICA
                        <span className="hidden sm:inline text-muted-foreground font-normal text-sm ml-2 tracking-widest">
                            — ARCANE NEXUS
                        </span>
                    </h1>
                </div>

                {/* ── Controls ── */}
                <div className="flex items-center gap-3">

                    {/* ── Back to menu button (only when a game is active) ── */}
                    {activeName && (
                        <Button
                            id="back-to-menu-btn"
                            variant="outline"
                            className="arcade-btn-back cursor-pointer flex items-center gap-1.5"
                            onClick={onBack}
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            MENÚ
                        </Button>
                    )}

                    {/* Active game badge */}
                    {activeName && (
                        <span className="game-badge">
                            {activeName}
                        </span>
                    )}

                    {/* Game selector (only when game is active) */}
                    {activeName && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    id="game-selector-btn"
                                    variant="outline"
                                    className="arcade-btn cursor-pointer"
                                >
                                    CAMBIAR JUEGO
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="bg-background text-foreground border border-border"
                                align="end"
                            >
                                {GAMES.map((g) => (
                                    <DropdownMenuItem
                                        key={g.name}
                                        id={`game-${g.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="cursor-pointer"
                                        onClick={() => onChangeSketch(g.sketch, g.name)}
                                    >
                                        {g.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Theme toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                id="theme-toggle-btn"
                                variant="outline"
                                size="icon"
                                className="arcade-btn-icon cursor-pointer"
                            >
                                <Sun className="h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                <Moon className="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                <span className="sr-only">Cambiar tema</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem id="theme-light" onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
                            <DropdownMenuItem id="theme-dark"  onClick={() => setTheme("dark")}>Oscuro</DropdownMenuItem>
                            <DropdownMenuItem id="theme-sys"   onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}