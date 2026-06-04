export const squareSketch = (p) => {
  p.setup = () => {
    p.createCanvas(1000, 500);
  };
  p.draw = () => {
    p.background(30);
    p.fill(239, 68, 68); // Rojo
    p.rectMode(p.CENTER);
    p.rect(p.mouseX, p.mouseY, 60, 60);
  };
};
