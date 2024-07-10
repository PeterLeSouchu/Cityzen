class ApiError extends Error {
  constructor(message, causeObj) {
    super(message, causeObj);
    this.status = causeObj.status;
    this.message = message;
  }
}

export default ApiError;