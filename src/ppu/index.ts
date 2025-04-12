import { Cpu } from '../cpu/index.ts';
import { u16 } from '../types/u16.ts';
import { u8 } from '../types/u8.ts';

export class PPU {
  mode: number = 0;
  modeclock: number = 0;
  line: number = 0;

  cpu: Cpu;

  constructor(cpu: Cpu) {
    this.cpu = cpu;
  }

  step(c: number) {
    this.modeclock += c;

    switch (this.mode) {
      case (2): {
        if (this.modeclock >= 80) {
          this.modeclock = 0;
          this.mode = 3;
        }

        break;
      }

      case (3): {
        if (this.modeclock >= 172) {
          this.modeclock = 0;
          this.mode = 0;

          // TODO write scanline to framebuffer
        }

        break;
      }

      case (0): {
        if (this.modeclock >= 204) {
          this.modeclock = 0;
          this.line++;

          if (this.line == 143) {
            this.mode = 1;
            // TODO print screen
          } else {
            this.mode = 2;
          }

          this.cpu.writeMemory(new u16(0xFF44), new u8(this.line));
        }

        break;
      }

      case (1): {
        if (this.modeclock >= 456) {
          this.modeclock = 0;
          this.line++;

          if (this.line > 153) {
            this.mode = 2;
            this.line = 0;
          }

          this.cpu.writeMemory(new u16(0xFF44), new u8(this.line));
        }

        break;
      }
    }
  }
}