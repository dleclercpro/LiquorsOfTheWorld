class MissingServerError extends Error {
  constructor() {
      super('MISSING_SERVER');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default MissingServerError;