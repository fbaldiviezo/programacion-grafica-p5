import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider"

import { pongSketch } from "@/components/sketchs/pongSketch";
import { snakeSketch } from "@/components/sketchs/snakeSketch";
import { breakoutSketch } from "@/components/sketchs/breakoutSketch";

export default function Navbar({ activeName, onChangeSketch }) {
    const { setTheme } = useTheme()

    return (
        <header className="sticky top-0 z-20 border-b border-border/80 bg-background/95 text-foreground px-4 py-4 shadow-sm backdrop-blur-sm transition-colors duration-300">
            <div className="mx-auto flex items-center justify-between gap-4 px-10">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Programación Gráfica - Juegos Arcade</h1>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="cursor-pointer">
                                {activeName || "Selecciona un juego"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-background text-foreground border border-border">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onChangeSketch(pongSketch, "Pong Arcade")}>Pong Classic</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onChangeSketch(snakeSketch, "Neon Snake")}>Neon Snake</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => onChangeSketch(breakoutSketch, "Galactic Breakout")}>Galactic Breakout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}