// its just a utiliy function which accept another function as parameter
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

/*
const asyncHandler = () => {}
const asyncHandler = () => { () => {}}
const asyncHandler = () =>  async () => {}
*/

/*
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(err.code || 500).json({
      success: true,
      message: err.message,
    });
  }
};

export { asyncHandler };
*/
