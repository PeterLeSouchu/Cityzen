class ApiError extends Error {
  #type = "ApiError";
  status;
  errorCode;

  constructor(message, causeObj, status, errorCode) {
    super(message, causeObj);
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
  }

  get type() {
    return this.#type;
  }
}

export default ApiError;