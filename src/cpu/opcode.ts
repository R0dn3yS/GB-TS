import { u16 } from '../types/u16.ts';
import { u8 } from '../types/u8.ts';
import { getString8 } from '../util/index.ts';
import { Cpu } from './index.ts';
import { ADDR16, CALL, CP, DEC, DI, INC, INC16, JP, JR, LD, LDD, LDH, LDHR, LDI, LDR, LDR16, LDSP, NOP, POP, PUSH, RET, RLA, RST, XOR } from './instructions.ts';
import { prefix } from './prefix.ts';

export function executeInstruction(cpu: Cpu, op: u8): number {
  let c = 0;

  switch (op.get()) {
    case (0x00): {
      NOP();

      c = 1;

      break;
    }

    case (0x01): {
      const data = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      LDR16(cpu, data, 'BC');

      c = 3;

      break;
    }

    case (0x04): {
      INC(cpu, cpu.B);

      c = 1;

      break;
    }

    case (0x05): {
      DEC(cpu, cpu.B);

      c = 1;

      break;
    }

    case (0x06): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      LDR(cpu, data, cpu.B);

      c = 2;

      break;
    }

    case (0x0C): {
      INC(cpu, cpu.C);

      c = 1;

      break;
    }

    case (0x0D): {
      DEC(cpu, cpu.C);

      c = 1;

      break;
    }

    case (0x0E): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      LDR(cpu, data, cpu.C);

      c = 2;

      break;
    }

    case (0x11): {
      const data = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      LDR16(cpu, data, 'DE');

      c = 3;

      break;
    }

    case (0x13): {
      INC16(cpu, 'DE');

      c = 2;

      break;
    }

    case (0x17): {
      RLA(cpu);

      c = 1;

      break;
    }

    case (0x18): {
      const jump = cpu.readMemory(cpu.pc).getSigned();

      JR(cpu, jump);

      c = 3;

      break;
    }

    case (0x1A): {
      const data = cpu.readMemory(cpu.getDE());

      LDR(cpu, data, cpu.A);

      c = 2;

      break;
    }

    case (0x1E): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      LDR(cpu, data, cpu.E);

      c = 2;

      break;
    }

    case (0x20): {
      const jump = cpu.readMemory(cpu.pc).getSigned();

      if (!cpu.flags.z.value) {
        JR(cpu, jump);
        c = 3;
      } else {
        cpu.incPc();
        c = 2;
      }

      break;
    }

    case (0x21): {
      const data = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      LDR16(cpu, data, 'HL');

      c = 3;

      break;
    }

    case (0x22): {
      LDI(cpu);

      c = 2;

      break;
    }

    case (0x23): {
      INC16(cpu, 'HL');

      c = 2;

      break;
    }

    case (0x28): {
      const jump = cpu.readMemory(cpu.pc).getSigned();
      cpu.incPc();

      if (cpu.flags.z.value) {
        JR(cpu, jump);
        c = 3;
      } else {
        cpu.incPc();
        c = 2;
      }

      break;
    }

    case (0x2E): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      LDR(cpu, data, cpu.L);

      c = 2;

      break;
    }

    case (0x31): {
      const data = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      LDSP(cpu, data);

      c = 3;

      break;
    }

    case (0x32): {
      LDD(cpu);

      c = 2;

      break;
    }

    case (0x39): {
      ADDR16(cpu, cpu.sp, 'HL');

      c = 2;

      break;
    }

    case (0x3D): {
      DEC(cpu, cpu.A);

      c = 1;

      break;
    }

    case (0x3E): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      LDR(cpu, data, cpu.A);

      c = 2;

      break;
    }

    case (0x47): {
      LDR(cpu, cpu.A, cpu.B);

      c = 2;

      break;
    }

    case (0x4F): {
      LDR(cpu, cpu.A, cpu.C);

      c = 2;

      break;
    }

    case (0x57): {
      LDR(cpu, cpu.A, cpu.D);

      c = 2;

      break;
    }

    case (0x67): {
      LDR(cpu, cpu.A, cpu.H);

      c = 2;

      break;
    }

    case (0x77): {
      const address = cpu.getHL();

      LD(cpu, cpu.A, address);

      c = 2;

      break;
    }

    case (0x7B): {
      LDR(cpu, cpu.E, cpu.A);

      c = 2;

      break;
    }

    case (0xAF): {
      XOR(cpu, cpu.A);

      c = 1;

      break;
    }

    case (0xC1): {
      POP(cpu, 'BC');

      c = 3;

      break;
    }

    case (0xC2): {
      const address = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);
  
      if (!cpu.flags.z.value) {
        JP(cpu, address);
        c = 4;
      } else {
        c = 3;
      }

      break;
    }

    case (0xC3): {
      const address = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      JP(cpu, address);
      c = 4;

      break;
    }

    case (0xC5): {
      PUSH(cpu, 'BC');

      c = 4;

      break;
    }

    case (0xC9): {
      RET(cpu);

      c = 4;

      break;
    }

    case (0xCB): {
      const nextOp = cpu.readMemory(cpu.pc);
      cpu.incPc();

      c = prefix(cpu, nextOp) + 1;

      break;
    }

    case (0xCC): {
      const address = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      if (cpu.flags.z) {
        CALL(cpu, address);
        c = 6;
      } else {
        c = 3;
      }

      break;
    }

    case (0xCD): {
      const address = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      CALL(cpu, address);
      c = 6;

      break;
    }

    case (0xE0): {
      const address = new u16(cpu.readMemory(cpu.pc).get() + 0xFF00);
      cpu.incPc();

      LDH(cpu, cpu.A, address);

      c = 2;

      break;
    }

    case (0xE2): {
      const address = new u16(cpu.C.get() + 0xFF00);

      LDH(cpu, cpu.A, address);

      c = 2;

      break;
    }

    case (0xEA): {
      const address = cpu.readMemory16(cpu.pc);
      cpu.incPc(2);

      LD(cpu, cpu.A, address);

      c = 4;

      break;
    }

    case (0xF0): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      LDHR(cpu, data, cpu.A);

      c = 3;

      break;
    }

    case (0xF3): {
      DI(cpu);

      c = 1;

      break;
    }

    case (0xFE): {
      const data = cpu.readMemory(cpu.pc);
      cpu.incPc();

      CP(cpu, data);

      c = 2;

      break;
    }

    case (0xFF): {
      RST(cpu, 0x38);

      c = 4;

      break;
    }

    default: {
      cpu.run = false;
      console.error(`Opcode ${getString8(op.get())} not found`);
    }
  }

  return c;
}