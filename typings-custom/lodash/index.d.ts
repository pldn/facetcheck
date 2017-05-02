declare module _ {
  interface LoDashStatic {
    /**
     * @see _.assign
     */
    assign<TObject extends {}>(...object: TObject[]): TObject;
    merge<TObject extends {}>(...object: TObject[]): TObject;
  }
}
