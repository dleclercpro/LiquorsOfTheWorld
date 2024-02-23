class UserCannotStartQuestionError extends Error {
  constructor() {
      super('USER_CANNOT_START_QUESTION_ERROR');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default UserCannotStartQuestionError;