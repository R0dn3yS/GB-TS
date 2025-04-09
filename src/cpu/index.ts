import { u16 } from '../types/u16.ts';
import { u8 } from '../types/u8.ts';
import { executeInstruction } from './opcode.ts';
import { Flag } from './flag.ts';

export class Cpu {
  pc = new u16(0x0000);
  sp = new u16(0xFFFE);

  A = new u8(0x00);
  B = new u8(0x00);
  C = new u8(0x00);
  D = new u8(0x00);
  E = new u8(0x00);
  H = new u8(0x00);
  L = new u8(0x00);

  flags = {
    'z': new Flag(false),
    'n': new Flag(false),
    'h': new Flag(false),
    'c': new Flag(false)
  }

  IME = true;

  run = true;

  private memory = new Uint8Array(0xFFFF);

  constructor() {
    this.memory.fill(0);
  }

  incPc(amount?: number) {
    this.pc.wrappingAdd(amount ? amount : 1);
  }

  loadRom(path: string) {
    const romData = Deno.readFileSync(path);

    for (let i = 0; i < 0x3FFF; i++) {
      this.memory[i] = romData[i];
    }
  }

  loadBios(path: string) {
    const biosData = Deno.readFileSync(path);

    for (let i = 0; i < 0x0100; i++) {
      this.memory[i] = biosData[i];
    }
  }

  readMemory(address: u16): u8 {
    return new u8(this.memory[address.get()]);
  }

  readMemory16(address: u16): u16 {
    const first = this.memory[address.get()];
    const second = this.memory[address.get() + 1];

    return new u16((second << 8) | first);
  }

  writeMemory(address: u16, value: u8) {
    this.memory[address.get()] = value.get();
  }

  getNextInstruction(): u8 {
    const op = this.readMemory(this.pc);
    this.incPc();
    return op;
  }

  execute(op: u8) {
    executeInstruction(this, op);
  }

  pushStack(value: u8) {
    this.memory[this.sp.get()] = value.get();
    this.sp.dec(1);
    if (this.sp.get() < 0xFF80) this.sp.set(0xFFFE);
  }

  pushStack16(value: u16) {
    const first = value.get() >> 8;
    const second = value.get() & 0xFF;

    this.memory[this.sp.get()] = first;
    this.memory[this.sp.get() - 4] = second;
    this.sp.dec(1);
    if (this.sp.get() < 0xFF80) this.sp.set(0xFFFE);
    this.sp.dec(1);
    if (this.sp.get() < 0xFF80) this.sp.set(0xFFFE);
  }

  popStack(): u8 {
    const data = this.readMemory(this.sp);
    this.sp.wrappingAdd(1);
    if (this.sp.get() > 0xFFFE) this.sp.set(0xFF80);

    return data;
  }

  popStack16(): u16 {
    const hi = this.readMemory(this.sp);
    this.sp.wrappingAdd(1);
    if (this.sp.get() > 0xFFFE) this.sp.set(0xFF80);

    const lo = this.readMemory(this.sp);
    this.sp.wrappingAdd(1);
    if (this.sp.get() > 0xFFFE) this.sp.set(0xFF80);

    return new u16(hi.get() << 8 | lo.get());
  }

  getAF(): u16 {
    const lo = (
      this.flags.z.getBit() << 7 |
      this.flags.n.getBit() << 6 |
      this.flags.h.getBit() << 5 |
      this.flags.c.getBit() << 4
    );
    const hi = this.A.get();

    return new u16((hi << 8) | lo);
  }

  getBC(): u16 {
    return new u16(this.B.get() << 8 | this.C.get());
  }

  getDE(): u16 {
    return new u16(this.D.get() << 8 | this.E.get());
  }
  
  getHL(): u16 {
    return new u16(this.H.get() << 8 | this.L.get());
  }

  writeAF(value: u16) {
    this.A.set((value.get() & 0xFF00) >> 8);
    this.writeFlags(new u8(value.get() & 0xFF));
  }

  writeBC(value: u16) {
    this.B.set((value.get() & 0xFF00) >> 8);
    this.C.set(value.get() & 0xFF);
  }

  writeDE(value: u16) {
    this.D.set((value.get() & 0xFF00) >> 8);
    this.E.set(value.get() & 0xFF);
  }

  writeHL(value: u16) {
    this.H.set((value.get() & 0xFF00) >> 8);
    this.L.set(value.get() & 0xFF);
  }

  writeFlags(value: u8) {
    this.flags.z.value = ((value.get() >> 7) & 0b1) !== 0;
    this.flags.n.value = ((value.get() >> 6) & 0b1) !== 0;
    this.flags.h.value = ((value.get() >> 5) & 0b1) !== 0;
    this.flags.c.value = ((value.get() >> 4) & 0b1) !== 0;
  }
}