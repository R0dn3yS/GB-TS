export class u8 {
  private value: number = 0;
  private max = 0xFF;

  constructor(value: number) {
    try {
      if (value >= 0 && value <= this.max) {
        this.value = value;
      } else {
        throw new TypeError('Value out of bounds');
      }
    } catch (e) {
      console.error(e);
    }
  }

  get() {
    return this.value;
  }

  set(value: number) {
    try {
      if (value >= 0 && value <= this.max) {
        this.value = value;
        return this.value;
      } else {
        throw new TypeError('Value out of bounds');
      }
    } catch (e) {
      console.error(e);
    }
  }

  wrappingAdd(value: number) {
    try {
      if (value >= 0) {
        this.value = (this.value + value) % (this.max + 1);
        return this.value;
      } else {
        throw new TypeError('Can\'t add negative number');
      }
    } catch (e) {
      console.error(e);
    }
  }

  overflowingAdd(value: number) {
    try {
      if (value >= 0) {
        this.value = this.value + value > this.max ? this.max : this.value + value;
        return this.value;
      } else {
        throw new TypeError('Can\'t add negative number');
      }
    } catch (e) {
      console.error(e);
    }
  }

  dec(value: number) {
    try {
      if (value >= 0) {
        this.value = this.value - value >= 0 ? this.value - value : 0;
        return this.value;
      } else {
        throw new TypeError('Can\'t decrease by negative number');
      }
    } catch (e) {
      console.error(e);
    }
  }

  wrappingDec(value: number) {
    try {
      if (value >= 0) {
        const val = this.value - value;
        this.value = (val + this.max) % this.max;
        return this.value;
      } else {
        throw new TypeError('Can\'t decrease by negative number');
      }
    } catch (e) {
      console.error(e);
    }
  }

  getSigned() {
    const isSigned = (this.value & 0b10000000) === 0b10000000;
    const value = (this.value & 0b01111111);
    return isSigned ? value - 127 : value;
  }
}