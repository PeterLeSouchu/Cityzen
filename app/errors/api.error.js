class ApiError extends Error {
  _origin = 'ApiError';

  constructor(errorType, message, causeObj) {
    super();
    this.errorType = errorType;
    this.message = message;
    this.causeObj = causeObj;
  }

  get origin() {
    return this._origin;
  }
}

export default ApiError;
