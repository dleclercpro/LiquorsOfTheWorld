class InvalidParamsError extends Error {
  constructor() {
      super('INVALID_PARAMS');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default InvalidParamsError;