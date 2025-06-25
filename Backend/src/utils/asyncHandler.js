const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err)=> next(err));
  };
}

export { asyncHandler };

// This utility function wraps an asynchronous function and catches any errors that occur, passing them to the next middleware in the Express.js error handling chain.
// It is useful for handling errors in asynchronous route handlers or middleware in an Express.js application.