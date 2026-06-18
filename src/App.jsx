import { useState } from "react"

import Navbar from './components/navbar'
import P5Canvas from '@/components/P5Canvas'
import { ThemeProvider } from "@/components/theme-provider"

import { pongSketch }     from "@/components/sketchs/pongSketch";
import { snakeSketch }    from "@/components/sketchs/snakeSketch";
import { breakoutSketch } from "@/components/sketchs/breakoutSketch";

export const GAMES = [
  { label: "Pong Classic",      sketch: pongSketch,     name: "Pong Classic" },
  { label: "Neon Snake",        sketch: snakeSketch,     name: "Neon Snake" },
  { label: "Galactic Breakout", sketch: breakoutSketch,  name: "Galactic Breakout" },
];

function App() {
  const [sketch, setSketch]         = useState(null)
  const [sketchName, setSketchName] = useState("")

  const handleChangeSketch = (newSketch, name) => {
    setSketch(() => newSketch)
    setSketchName(name)
  }

  const handleBack = () => {
    setSketch(null)
    setSketchName("")
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="arcade-ui-theme">
      <div className="min-h-screen min-w-full bg-background text-foreground transition-colors duration-300">
        <Navbar
          activeName={sketchName}
          onChangeSketch={handleChangeSketch}
          onBack={handleBack}
        />

        <main className="flex flex-1 flex-row px-4 py-8">
          <div className="flex flex-1 items-center justify-center">
            <P5Canvas
              sketchCode={sketch}
              games={GAMES}
              onChangeSketch={handleChangeSketch}
            />
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
