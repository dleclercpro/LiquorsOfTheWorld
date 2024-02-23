class InvalidLanguageError extends Error {
  constructor() {
      super('INVALID_LANGUAGE');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default InvalidLanguageError;