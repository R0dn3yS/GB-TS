import { u16 } from '../types/u16.ts';
import { u8 } from '../types/u8.ts';
import { getString8 } from '../util/index.ts';
import { Cpu } from './index.ts';
import { ADDR16, CALL, CP, DEC, DI, INC, JP, JR, LD, LDD, LDH, LDHR, LDR, LDR16, LDSP, NOP, POP, PUSH, RLA, RST, XOR } from './instructions.ts';
import { prefix } from './prefix.ts';

export function executeInstruction(cpu: Cpu, op: u8) {
  switch (op.get()) {
    case (0x00): {
      NOP();

      break;
    }

    case (0x01): {
      const data = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      LDR16(cpu, data, 'BC');

      break;
    }

    case (0x05): {
      DEC(cpu, cpu.B);

      break;
    }

    case (0x06): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      LDR(cpu, data, cpu.B);

      break;
    }

    case (0x0C): {
      INC(cpu, cpu.C);

      break;
    }

    case (0x0E): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      LDR(cpu, data, cpu.C);

      break;
    }

    case (0x11): {
      const data = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      LDR16(cpu, data, 'DE');

      break;
    }

    case (0x17): {
      RLA(cpu);

      break;
    }

    case (0x18): {
      const jump = cpu.readMemory(cpu.pc).getSigned();
      cpu.incPc();

      JR(cpu, jump);

      break;
    }

    case (0x1A): {
      const data = cpu.readMemory(cpu.getDE());

      LDR(cpu, data, cpu.A);

      break;
    }

    case (0x20): {
      const jump = cpu.readMemory(cpu.pc).getSigned();

      if (!cpu.flags.z.value) {
        JR(cpu, jump);
      } else {
        cpu.incPc();
      }

      break;
    }

    case (0x21): {
      const data = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      LDR16(cpu, data, 'HL');

      break;
    }

    case (0x28): {
      const jump = cpu.readMemory(cpu.pc).getSigned();
      cpu.incPc();

      if (cpu.flags.z.value) {
        JR(cpu, jump);
      }

      break;
    }

    case (0x31): {
      const data = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      LDSP(cpu, data);

      break;
    }

    case (0x32): {
      LDD(cpu);

      break;
    }

    case (0x39): {
      ADDR16(cpu, cpu.sp, 'HL');
      
      break;
    }

    case (0x3E): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      LDR(cpu, data, cpu.A);

      break;
    }

    case (0x47): {
      LDR(cpu, cpu.A, cpu.B);

      break;
    }

    case (0x4F): {
      LDR(cpu, cpu.A, cpu.C);

      break;
    }

    case (0x77): {
      const address = cpu.getHL();

      LD(cpu, cpu.A, address);

      break;
    }

    case (0xAF): {
      XOR(cpu, cpu.A);

      break;
    }

    case (0xC1): {
      POP(cpu, 'BC');

      break;
    }

    case (0xC2): {
      const address = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);
  
      if (!cpu.flags.z.value) {
        JP(cpu, address);
      }

      break;
    }

    case (0xC3): {
      const address = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      JP(cpu, address);

      break;
    }

    case (0xC5): {
      PUSH(cpu, 'BC');

      break;
    }

    case (0xCB): {
      const nextOp = cpu.readMemory(cpu.pc);
      cpu.incPc();

      prefix(cpu, nextOp);

      break;
    }

    case (0xCC): {
      const address = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      if (cpu.flags.z) {
        CALL(cpu, address);
      }

      break;
    }

    case (0xCD): {
      const address = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      CALL(cpu, address);

      break;
    }

    case (0xE0): {
      const address = new u16(cpu.readMemory(cpu.pc).get() + 0xFF00);
      cpu.incPc();

      LDH(cpu, cpu.A, address);

      break;
    }

    case (0xE2): {
      const address = new u16(cpu.C.get() + 0xFF00);

      LDH(cpu, cpu.A, address);

      break;
    }

    case (0xEA): {
      const address = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      LD(cpu, cpu.A, address);

      break;
    }

    case (0xF0): {
      const from = cpu.readMemory(cpu.pc);
      cpu.incPc();

      LDHR(cpu, from, cpu.A);

      break;
    }

    case (0xF3): {
      DI(cpu);

      break;
    }

    case (0xFE): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      CP(cpu, data);

      break;
    }

    case (0xFF): {
      RST(cpu, 0x38);
      break;
    }

    default: {
      cpu.run = false;
      return console.error(`Opcode ${getString8(op.get())} not found`);
    }
  }
}