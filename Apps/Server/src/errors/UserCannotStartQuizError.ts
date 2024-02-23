class UserCannotStartQuizError extends Error {
  constructor() {
      super('USER_CANNOT_START_QUIZ_ERROR');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default UserCannotStartQuizError;