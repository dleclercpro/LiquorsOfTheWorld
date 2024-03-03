class UserCannotDeleteDatabaseError extends Error {
  constructor() {
      super('USER_CANNOT_DELETE_DATABASE_ERROR');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default UserCannotDeleteDatabaseError;