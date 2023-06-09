function testForNumber(num) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const number = data[num];
    if (typeof number === "number" && number > 0 ) {
      return next();
    }
    next({
      status: 400,
      message: `Dish must have a price that is a non-negative integer`,
    });
  };
}

module.exports = testForNumber;