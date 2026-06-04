import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider"

import { circleSketch } from "@/components/sketchs/circleSketch";
import { squareSketch } from "@/components/sketchs/squareSketch";

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
                        <DropdownMenuTrigger>
                            <Button variant="outline" >
                                {activeName || "Selecciona un juego"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onChangeSketch(circleSketch, "Efecto del circulo")}>Circulos</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onChangeSketch(squareSketch, "Efecto del cuadrado")}>Cuadrados</DropdownMenuItem>
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