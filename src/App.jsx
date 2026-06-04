import { useState } from "react"

import Navbar from './components/navbar'
import P5Canvas from '@/components/P5Canvas'

import { circleSketch } from "@/components/sketchs/circleSketch";
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  const [sketch, setSketch] = useState(null)
  const [sketchName, setSketchName] = useState("")

  const handleChangeSketch = (newSketch, name) => {
    setSketch(() => newSketch)
    setSketchName(name)
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen min-w-full bg-slate-50 text-slate-950">
        <Navbar activeName={sketchName} onChangeSketch={handleChangeSketch} />
          <div className="gap-2 flex flex-1 flex-row">  
            <div className="flex flex-1 items-center justify-center mt-10">
              <P5Canvas sketchCode={sketch} />
            </div>
          </div>
      </div>
    </ThemeProvider>
  )
}

export default App
