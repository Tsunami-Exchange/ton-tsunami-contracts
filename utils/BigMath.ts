export class BigMath {
  static abs(n: bigint) {
    return n < 0n ? -n : n;
  }

  static max(...args: bigint[]) {
    return args.reduce((m, e) => (e > m ? e : m));
  }

  static min(...args: bigint[]) {
    return args.reduce((m, e) => (e < m ? e : m));
  }
}
