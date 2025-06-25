class APIerror extends Error {
  constructor(
    message ="somethinf went wrong", 
    statusCode,
    error=[],
    stack=""
  ){
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.error = error;
    this.success = false;
    this.isOperational = true; 
    Error.captureStackTrace(this, this.constructor);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { APIerror };