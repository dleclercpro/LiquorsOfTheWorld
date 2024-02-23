class InvalidQuestionIndexError extends Error {
  constructor() {
      super('INVALID_QUESTION_INDEX');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default InvalidQuestionIndexError;