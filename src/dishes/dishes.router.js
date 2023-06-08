const router = require("express").Router({ mergeParams: true });
const controller = require("./dishes.controller")

// error handler for addressing banned methods on the site
const methodNotAllowed = require("../errors/methodNotAllowed");

// routing for /:dishId 
// read a requested Dish 
// update an existing Dish
router.route('/:dishId')
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed)


// routing for /dishes
// lists all the dishes
// add a new dish to the list
router.route('/')
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed)

module.exports = router;
