function testForString(string) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (
            data[string] &&
            (data[string].length > 0 || Number(data[string]) || Array.isArray(data[prop]))
        ) {
            return next();
        }
        next({
            status: 400,
            message: `Dish must include a ${string}`,
        });
    };

}

module.exports = testForString