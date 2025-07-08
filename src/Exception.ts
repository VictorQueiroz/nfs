export default class Exception extends Error {
  public constructor(message: string) {
    super(message);
  }

  public override toString(): string {
    return this.message;
  }

  [Symbol.toPrimitive]() {
    return this.message;
  }
}
