import { u8 } from '../types/u8.ts';
import { getString8 } from '../util/index.ts';
import { Cpu } from './index.ts';
import { BIT, RES, RL } from './instructions.ts';

export function prefix(cpu: Cpu, op: u8): number {
  let c = 0;

  switch(op.get()) {
    case (0x11): {
      RL(cpu, cpu.C);
      
      c = 2;

      break;
    }

    case (0x7C): {
      BIT(cpu, 7, cpu.H);

      c = 2;

      break;
    }

    case (0x87): {
      RES(cpu, 0, cpu.A);

      c = 2;

      break;
    }

    default: {
      cpu.run = false;
      console.error(`Prefixed opcode ${getString8(op.get())} not found`);
    }
  }

  return c;
}