class ApiError extends Error {
  status;
  errorCode;

  constructor(message, causeObj, status, errorCode) {
    super(message, causeObj);
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
  }
}

export default ApiError;