const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// middleware for error handling
const testForString = require("../middleware/testForString");
const testForNumber = require("../middleware/testForNumber");

// /dishes handlers needed to make the tests pass

// lists out the entire dish catalogue
function list(req, res) {
    res.json({ data: dishes });
}

// creates a new dish recipe 
function create(req, res){
  const { data: { name, description, price, image_url } = {} } = req.body;
  
  const newDish = {
    name,
    description,
    price,
    image_url,
    id: nextId(),
  };
  
  dishes.push(newDish);
  res.status(201).json({ data: newDish })
}

// reads a specific requested dish
function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

// updates a dish and all its parameters
function update(req, res, next){
  const { data: { name, description, price, image_url } = {} } = req.body;
  const dish = res.locals.dish;
 
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;
  
  res.json({data: dish})
}

// middleware to check for a dishes existance within the API
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const dishIdExistes = dishes.find((dish) => dish.id === dishId);
  if (dishIdExistes){
    res.locals.dish = dishIdExistes;
    return next();
  } 
  next({
    status : 404,
    message : `Dish does not exist: ${dishId}.`
  });
};

// middleware to identify that the given dish ID matches the routed ID
function checkForIdMatch(req, res, next) {
  const { data: { id }} = req.body;
  const checkId = res.locals.dish.id;
  if (!id || id === checkId) { return next() }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${checkId}`,
  });
}

// exported functions sent to the dishes.router.js file
module.exports = {
  list,
  read: [dishExists, read],
  create: [ 
    testForString("name"), 
    testForString("description"),
    testForString("price"),
    testForNumber("price"),
    testForString("image_url"),
    create,
  ],
  update: [
    dishExists,
    checkForIdMatch,
    testForString("name"),
    testForString("description"),
    testForString("price"),
    testForNumber("price"),
    testForString("image_url"),
    update,
  ],
}
