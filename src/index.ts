import { Cpu } from './cpu/index.ts';
import { LCD } from './lcd/index.ts';
import { PPU } from './ppu/index.ts';
import { u16 } from './types/u16.ts';
import { readState } from './util/index.ts';

// const lcd = new LCD();
const cpu = new Cpu();
const ppu = new PPU(cpu);

cpu.loadRom('./rom.gb');
// cpu.loadBios('./bios.gb');

cpu.loadInitialState();

let step = false;

// lcd.reset();
// lcd.present();

while(cpu.run === true) {
  if (cpu.pc.get() === 0x0071) step = true;
  // if (cpu.A.get() === 0x90) step = true;
  // if (cpu.readMemory(new u16(0xFF44)).get() === 0x90)  step = true;

  readState(cpu);

  if (step) {
    cpu.dumpMemory();
    prompt('');
  };

  const op = cpu.getNextInstruction();
  const c = cpu.execute(op);
  ppu.step(c);
}