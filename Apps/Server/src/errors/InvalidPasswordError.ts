class InvalidPasswordError extends Error {
  constructor() {
      super('INVALID_PASSWORD');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default InvalidPasswordError;