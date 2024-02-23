class InvalidQuizIdError extends Error {
  constructor() {
      super('INVALID_QUIZ_ID');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default InvalidQuizIdError;