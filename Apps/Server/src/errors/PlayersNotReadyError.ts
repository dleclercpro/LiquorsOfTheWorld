class PlayersNotReadyError extends Error {
  constructor() {
      super('PLAYERS_NOT_READY');
      this.name = this.constructor.name;
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export default PlayersNotReadyError;