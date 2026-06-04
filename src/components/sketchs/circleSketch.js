export const circleSketch = (p) => {
    p.setup = () => {
        p.createCanvas(400, 400);
    };
    p.draw = () => {
        p.background(20);
        p.fill(59, 130, 246); // Azul
        p.ellipse(p.mouseX, p.mouseY, 60, 60);
    };
}