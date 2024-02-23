class UserAlreadyExistsError extends Error {
  constructor() {
      super('USER_ALREADY_EXISTS');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default UserAlreadyExistsError;