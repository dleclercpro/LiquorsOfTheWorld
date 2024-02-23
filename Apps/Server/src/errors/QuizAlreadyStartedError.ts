class QuizAlreadyStartedError extends Error {
  constructor() {
      super('QUIZ_ALREADY_STARTED');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default QuizAlreadyStartedError;