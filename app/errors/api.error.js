class ApiError extends Error {
  _type = "ApiError";
  status;
  errorCode;

  constructor(message, causeObj, status, errorCode) {
    super(message, causeObj);
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
  }

  get type() {
    return this._type;
  }


}

export default ApiError;