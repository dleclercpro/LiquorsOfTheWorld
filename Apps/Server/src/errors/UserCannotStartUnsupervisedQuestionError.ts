class UserCannotStartUnsupervisedQuestionError extends Error {
  constructor() {
      super('USER_CANNOT_START_UNSUPERVISED_QUESTION');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default UserCannotStartUnsupervisedQuestionError;