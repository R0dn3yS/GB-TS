import { Canvas, Window, WindowBuilder } from 'jsr:@divy/sdl2@0.14.0';

export class LCD {
  private screen = new Array(160 * 144 * 4);

  private window: Window;
  private canvas: Canvas;

  constructor() {
    this.window = new WindowBuilder('Gameboy Emulator', 160, 144).build();
    this.canvas = this.window.canvas();
  }

  reset() {
    for (let i = 0; i < 160 * 144 * 4; i++) {
      this.screen[i] = 255;
    }

    this.canvas.setDrawColor(255, 255, 255, 255);
    this.canvas.clear();
  }

  present() {
    this.canvas.present();
  }
}