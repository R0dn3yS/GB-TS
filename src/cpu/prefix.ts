import { u8 } from '../types/u8.ts';
import { getString8 } from '../util/index.ts';
import { Cpu } from './index.ts';
import { BIT, RES, RL } from './instructions.ts';

export function prefix(cpu: Cpu, op: u8) {
  switch(op.get()) {
    case (0x11): {
      RL(cpu, cpu.C);
      
      break;
    }

    case (0x7C): {
      BIT(cpu, 7, cpu.H);

      break;
    }

    case (0x87): {
      RES(cpu, 0, cpu.A);

      break;
    }

    default: {
      cpu.run = false;
      return console.error(`Prefixed opcode ${getString8(op.get())} not found`);
    }
  }
}