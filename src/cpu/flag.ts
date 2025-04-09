export class Flag {
  value: boolean;

  constructor(val?: boolean) {
    this.value = val ?? false;
  }

  getBit() {
    return this.value ? 1 : 0;
  }
}