import Imm = require("immutable");
declare module "immutable" {
  export namespace Record { export type Inst<I> = Readonly<I> & Imm.Record.Instance<I>; }
}
