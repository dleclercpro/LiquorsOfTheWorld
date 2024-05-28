class InvalidTeamIdError extends Error {
  constructor() {
      super('INVALID_TEAM_ID');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default InvalidTeamIdError;