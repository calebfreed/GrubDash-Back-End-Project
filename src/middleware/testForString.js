function testForString(string) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const str = data[string]
    if (str && (str.length > 0 || Number(str))) {
      return next();
    }
    next({
      status: 400,
      message: `Dish must include a ${string}`,
    });
  };
}

module.exports = testForString