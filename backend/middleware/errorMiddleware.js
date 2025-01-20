const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error:', err.stack);
    }
  
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    res.status(statusCode).json({
      message: err.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  export { errorHandler };
  