import { u16 } from '../types/u16.ts';
import { u8 } from '../types/u8.ts';
import { Cpu } from './index.ts';

const bits = [
  0b11111110,
  0b11111101,
  0b11111011,
  0b11110111,
  0b11101111,
  0b11011111,
  0b10111111,
  0b01111111,
];

const reverseBit = [
  0b00000001,
  0b00000010,
  0b00000100,
  0b00001000,
  0b00010000,
  0b00100000,
  0b01000000,
  0b10000000,
];

export function NOP() {
  return;
}

export function CP(cpu: Cpu, data: u8) {
  const A = cpu.A.get();
  const compareVal = data.get();
  
  const result = A - compareVal;

  cpu.flags.z.value = result === 0;
  cpu.flags.n.value = true;
  cpu.flags.c.value = A < compareVal;
  cpu.flags.h.value = ((A & 0xF) - (compareVal & 0xF)) < 0;
}

export function JP(cpu: Cpu, address: u16) {
  cpu.pc.set(address.get());

  return;
}

export function CALL(cpu: Cpu, address: u16) {
  cpu.pushStack16(cpu.pc);
  JP(cpu, address);

  return;
}

export function JR(cpu: Cpu, jump: number) {
  if (jump > 0) {
    cpu.pc.wrappingAdd(jump);
  } else if (jump < 0) {
    cpu.pc.wrappingDec(jump *= -1);
  } else {
    cpu.incPc();
  }

  return;
}

export function XOR(cpu: Cpu, register: u8) {
  const result = cpu.A.get() ^ register.get();
  cpu.A.set(result);

  cpu.flags.z.value = result === 0;
  cpu.flags.n.value = false;
  cpu.flags.c.value = false;
  cpu.flags.h.value = false;

  return;
}

export function LDH(cpu: Cpu, from: u8, to: u16) {
  from.wrappingAdd(0xFF00);
  if (to.get() >= 0xFF00 && to.get() <= 0xFFFF) {
    LD(cpu, from, to);
  }

  return;
}

export function LDHR(cpu: Cpu, from: u8, to: u8) {
  const address = new u16(from.get());
  address.wrappingAdd(0xFF00);

  if (to.get() >= 0xFF00 && to.get() <= 0xFFFF) {
    const data = cpu.readMemory(address);
    LDR(cpu, data, to);
  }
}

export function LD(cpu: Cpu, from: u8, to: u16) {
  cpu.writeMemory(to, from);

  return;
}

export function LDR(_cpu: Cpu, data: u8, to: u8) {
  to.set(data.get());

  return;
}

export function LDSP(cpu: Cpu, data: u16) {
  cpu.sp.set(data.get());

  return;
}

export function LDR16(cpu: Cpu, data: u16, to: 'BC'|'DE'|'HL') {
  switch (to) {
    case ('BC'): {
      cpu.writeBC(data);

      break;
    }

    case ('DE'): {
      cpu.writeDE(data);

      break;
    }

    case ('HL'): {
      cpu.writeHL(data);
    }
  }

  return;
}

export function LDD(cpu: Cpu) {
  const HL = cpu.getHL();
  cpu.writeMemory(HL, cpu.A);

  HL.wrappingDec(1);

  cpu.writeHL(HL);
  
  return;
}

export function DI(cpu: Cpu) {
  cpu.IME = false;

  return;
}

export function RST(cpu: Cpu, address: number) {
  cpu.pushStack16(cpu.pc);
  cpu.pc.set(address);

  return;
}

export function ADDR16(cpu: Cpu, value: u16, to: 'HL'|'SP') {
  let reg: u16;
  let result: number;

  switch (to) {
    case ('HL'): {
      reg = cpu.getHL();
      result = cpu.getHL().get() + value.get();
      cpu.writeHL(new u16(cpu.getHL().wrappingAdd(value.get())!));

      break;
    }

    case ('SP'): {
      reg = cpu.sp;
      result = cpu.sp.get() + value.get();
      cpu.sp.wrappingAdd(value.get());

      break;
    }
  }

  const mask = 0b11111111111;

  cpu.flags.n.value = false;
  cpu.flags.c.value = result > 0xFF;
  cpu.flags.h.value = (value.get() & mask) + (reg.get() & mask) > mask;
  

  return;
}

export function INC(cpu: Cpu, register: u8) {
  const initial = register.get();
  const result = register.wrappingAdd(1);

  cpu.flags.z.value = result === 0;
  cpu.flags.n.value = false;
  cpu.flags.h.value = (((initial & 0xF) + (1 & 0xF)) & 0x10) === 0x10;
}

export function PUSH(cpu: Cpu, register: 'AF'|'BC'|'DE'|'HL') {
  switch (register) {
    case ('AF'): {
      cpu.pushStack16(cpu.getAF());

      break;
    }

    case ('BC'): {
      cpu.pushStack16(cpu.getBC());

      break;
    }

    case ('DE'): {
      cpu.pushStack16(cpu.getDE());

      break;
    }

    case ('HL'): {
      cpu.pushStack16(cpu.getHL());

      break;
    }
  }
}

export function POP(cpu: Cpu, register: 'AF'|'BC'|'DE'|'HL') {
  switch (register) {
    case ('AF'): {
      const data = cpu.popStack16();

      cpu.writeAF(data);

      break;
    }

    case ('BC'): {
      const data = cpu.popStack16();

      cpu.writeBC(data);

      break;
    }

    case ('DE'): {
      const data = cpu.popStack16();

      cpu.writeDE(data);

      break;
    }

    case ('HL'): {
      const data = cpu.popStack16();

      cpu.writeHL(data);

      break;
    }
  }
}

export function RES(_cpu: Cpu, bit: number, register: u8) {
  register.set(register.get() & bits[bit]);

  return;
}

export function BIT(cpu: Cpu, bit: number, register: u8) {
  const result = (reverseBit[bit] & register.get()) !== reverseBit[bit];

  cpu.flags.z.value = result;
  cpu.flags.n.value = false;
  cpu.flags.h.value = true;
}

export function RL(cpu: Cpu, register: u8) {
  const initial = register.get();
  const curCarry = cpu.flags.c.value;
  const result = ((initial << 1) & 0b011111111) | (curCarry ? 0b00000001 : 0);

  register.set(result);

  cpu.flags.z.value = result === 0;
  cpu.flags.n.value = false;
  cpu.flags.h.value = false;
  cpu.flags.c.value = initial > 128;
}

export function RLA(cpu: Cpu) {
  const initial = cpu.A.get();
  const curCarry = cpu.flags.c.value;
  const result = ((initial << 1) & 0b011111111) | (curCarry ? 0b00000001 : 0);

  cpu.A.set(result);

  cpu.flags.z.value = false;
  cpu.flags.n.value = false;
  cpu.flags.h.value = false;
  cpu.flags.c.value = initial > 128;
}

export function DEC(cpu: Cpu, register: u8) {
  const reg = register.get();

  const result = register.get() - 1;
  register.wrappingDec(1);

  cpu.flags.z.value = result === 0;
  cpu.flags.n.value = true;
  cpu.flags.h.value = ((reg & 0xF) - (1 & 0xF)) < 0;
}
