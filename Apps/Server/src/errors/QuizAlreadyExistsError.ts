class QuizAlreadyExistsError extends Error {
  constructor() {
      super('QUIZ_ALREADY_EXISTS');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default QuizAlreadyExistsError;