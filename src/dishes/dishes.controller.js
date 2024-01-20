const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function hasName(req, res, next) {
  const { data: { name } = {} } = req.body;

  if (name) {
    return next();
  }
  next({ status: 400, message: "Dish must include a name." });
}

function hasDescription(req, res, next) {
  const { data: { description } = {} } = req.body;

  if (description) {
    return next();
  }
  next({ status: 400, message: "Dish must include a description." });
}

function hasPrice(req, res, next) {
  const { data: { price } = {} } = req.body;

  if (price && Number.isInteger(price) && price >= 0) {
    return next();
  }
  next({ status: 400, message: "Dish must include a price." });
}

function hasImageUrl(req, res, next) {
  const { data: { image_url } = {} } = req.body;

  if (image_url) {
    return next();
  }
  next({ status: 400, message: "Dish must include a image_url." });
}

function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}.`,
  });
}

/*function idMatchesPut(req, res, next) {
  const dishId = req.params.dishId;
  const { data: { id } = {} } = req.body;

  if (dishId == id) {
    return next();
  }
  next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}` });
}*/



function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;

    const newDish = {
      id: nextId(),
      name: name,
      description: description,
      price: price,
      image_url: image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
  }

  function list(req, res) {
    res.json({ data: dishes });
  }

  function read(req, res) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => (dish.id = dishId));
    res.json({ data: foundDish });
  }
  
  function update(req, res, next) {
    const dish = res.locals.dish;
    //const dishId = req.params.dishId;
    const { data: { name, description, price, image_url, id } = {} } = req.body;

    
      if (id && dish.id !== id) {
        return next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${dish.id}` });
      }
    

    //const foundDish = dishes.find((dish) => dish.id === dishId);
    
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;

  
    res.status(200).json({ data: dish });
  }



/*
  function readIncludeUses(req, res) {
    const urlId = Number(req.params.urlId);
    const foundUses = uses.filter((use) => use.urlId == urlId)
  
    res.json({ data: foundUses });
  }
  
  function readFilterByUseId(req, res) {
    const urlId = Number(req.params.urlId);
    const useId = Number(req.params.useId);
  
    const foundUses = uses.filter((use) => use.urlId == urlId)
    const foundUsesFilteredById = foundUses.find((use) => use.id = useId)
  
    res.json({ data: foundUsesFilteredById });
  }

*/



module.exports = {
  create: [hasName, hasDescription, hasPrice, hasImageUrl, create],
    list: list,
    read: [dishExists, read],
    update: [dishExists, hasName, hasDescription, hasPrice, hasImageUrl, update],
  };
  