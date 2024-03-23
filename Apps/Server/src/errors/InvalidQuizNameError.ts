class InvalidQuizNameError extends Error {
  constructor() {
      super('INVALID_QUIZ_NAME');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default InvalidQuizNameError;