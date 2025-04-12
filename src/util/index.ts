import { Cpu } from '../cpu/index.ts';
import { u16 } from '../types/u16.ts';

export function getString8(num: number) {
  return '0x' + num.toString(16).padStart(2, '0').toUpperCase();
}

export function getString16(num: number) {
  return '0x' + num.toString(16).padStart(4, '0').toUpperCase();
}

export function readState(cpu: Cpu) {
  console.log('---------------------------------');
  console.log(`PC: ${getString16(cpu.pc.get())}`);
  console.log(`SP: ${getString16(cpu.sp.get())}`);
  console.log('');
  console.log(`AF: ${getString16(cpu.getAF().get())}`);
  console.log(`BC: ${getString16(cpu.getBC().get())}`);
  console.log(`DE: ${getString16(cpu.getDE().get())}`);
  console.log(`HL: ${getString16(cpu.getHL().get())}`);
  console.log(`\nFlags: ${cpu.flags.z.getBit()} ${cpu.flags.n.getBit()} ${cpu.flags.h.getBit()} ${cpu.flags.c.getBit()}`);
  console.log(`\nOpcode: ${getString8(cpu.readMemory(cpu.pc).get())}`);

  const mem: string[] = [];
  for (let i = 0; i < 8; i++) {
    const pc = new u16(cpu.pc.get() + i);
    mem.push(getString8(cpu.readMemory(pc).get()));
  }

  // const otherMem: string[] = [];
  // for (let i = 0; i < 8; i++) {
  //   const c = new u16(0xFFFF - i);
  //   otherMem.push(getString8(cpu.readMemory(c).get()));
  // }

  console.log(`\nMemory: ${mem}\n`);
  console.log(`0xFF44: ${getString8(cpu.readMemory(new u16(0xFF44)).get())}`);
  // console.log(`\nOther memory: ${otherMem}\n`);
}