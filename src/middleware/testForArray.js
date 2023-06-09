function testForArray(array) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const arr = data[array];
    
    if (Array.isArray(arr) && arr.length > 0) {
      return next();
    }
    next({
      status: 400,
      message: `Order must include at least one dish`,
    });
  };
}

module.exports = testForArray;