class UserDoesNotExistError extends Error {
  constructor() {
      super('USER_DOES_NOT_EXIST');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default UserDoesNotExistError;