const path = require("path");

const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// middleware to test if certain values are present or not
const testForString = require("../middleware/testForString");
const testForNumber = require("../middleware/testForNumber");
// const testForArray = require("../middleware/testForArray")

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res) {
  res.json({ data: orders });
}

function read(req, res, next) {
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

function destroy(req, res, next) {
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

function checkForIdMatch(req, res, next) {
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
//     testForArray("dishes"),
    hasDishes,
    create,
  ],
  update: [],
  delete: [ 
    orderExists, 
    isOrderPending, 
    destroy
  ],
}