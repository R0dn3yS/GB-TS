import { Cpu } from './cpu/index.ts';
import { readState } from './util/index.ts';

const cpu = new Cpu;
cpu.loadRom('./rom.gb');
cpu.loadBios('./bios.gb');

let step = false;

while(cpu.run === true) {
  readState(cpu);
  const op = cpu.getNextInstruction();
  cpu.execute(op);

  if (cpu.pc.get() === 0x0098) step = true;

  if (step) prompt('');
}