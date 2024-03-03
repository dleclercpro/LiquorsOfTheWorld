class UserCannotDeleteQuizError extends Error {
  constructor() {
      super('USER_CANNOT_DELETE_QUIZ_ERROR');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default UserCannotDeleteQuizError;