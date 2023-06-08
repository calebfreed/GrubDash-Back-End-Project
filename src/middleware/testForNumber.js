function testForNumber(prop) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const number = data[prop];
    if (typeof number === "number" && number > 0 && number === Math.floor(number)) {
      return next();
    }
    next({
      status: 400,
      message: `Dish must have a price that is a non-negative integer`,
    });
  };
}

module.exports = testForNumber;