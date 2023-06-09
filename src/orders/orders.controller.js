const path = require("path");

const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// middleware to test if certain values are present or not
const testForString = require("../middleware/testForString");
const testForNumber = require("../middleware/testForNumber");
const testForArray = require("../middleware/testForArray")

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res){
  res.json({ data: orders });
}

function read(req, res, next){
  res.json({ data: res.locals.order });
}

function create(req, res){
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  
  orders.push(newOrder);
  res.status(201).json({ data: newOrder })
}

function update(req, res, next){
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const order = res.locals.order;
 
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  
  res.json({data: order })
}

function destroy(req, res, next){
  const orderId = req.params.orderId;
  const index = orders.findIndex((order) => order.id === orderId);
  const deletedOrders = orders.splice(index, 1);
  res.sendStatus(204);
}

function orderExists(req, res, next){
  const { orderId } = req.params;
  const orderIdExists = orders.find((order) => order.id === orderId);
  
  if (orderIdExists){
    res.locals.order = orderIdExists
    return next()
  }
  next({
    status: 404,
    message: `Order id not found: ${orderId}`,
  })
}

function isOrderPending(req, res, next){
  const { orderId } = req.params;
  const { status } = res.locals.order
  if(status === "pending"){
    return next()
  }
  next ({
    status: 400,
    message: "An order cannot be deleted unless it is pending."
  })
}

function checkForIdMatch(req, res, next){
  const { data: { id }} = req.body;
  const checkId = res.locals.dish.id;
  if (!id || id === checkId) { return next() }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${checkId}`,
  });
};

function hasDishes(req, res, next){
  const { data: {dishes}} = req.body;
  console.log(dishes)
  next()
}

function testForQuantity(req, res, next){
  const { data: { dishes } = {} } = req.body;
  let index = -1;
  if (
    dishes.every((dish, dishIndex) => {
      const quantity = dish.quantity;
      const quantityExits =
        typeof quantity === "number" &&
        quantity > 0 &&
        Math.floor(quantity) === quantity;
      if (!quantityExits) index = dishIndex;
      return quantityExits;
    })
  ) {
    return next();
  }
  next({
    status: 400,
    message: `Dish ${index} must have a quantity that is an integer greater than 0`,
  });
}

function testForStatus(req, res, next) {
  const status = res.locals.order.status;
  if (req.body.data.status === "invalid"){
    return next({ status: 400, message: "status" })
  }
  if (status !== "delivered") {
    return next();
  }
  next({
    status: 400,
    message: `A delivered order cannot be changed`,
  });
}

function checkForIdMatch(req, res, next){
  const { data: { id }} = req.body;
  const orderId = res.locals.order.id;
  if (!id || id === orderId) { return next() }
  next({
    status: 400,
    message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
  });
}

module.exports = {
  list,
  read: [ 
    orderExists, 
    read 
  ],
  create: [ 
    testForString("deliverTo"),
    testForString("mobileNumber"),
    testForString("dishes"),
    testForArray("dishes"),
    testForQuantity,
    create,
  ],
  update: [ 
    orderExists,
    checkForIdMatch,
    testForString("deliverTo"),
    testForString("mobileNumber"),
    testForString("dishes"),
    testForArray("dishes"),
    testForQuantity,
    testForString("status", "Order must have a status of pending, preparing, out-for-delivery, delivered"),
    testForStatus,
    update, 
  ],
  delete: [ 
    orderExists, 
    isOrderPending, 
    destroy
  ],
}