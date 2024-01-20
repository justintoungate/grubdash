const e = require("express");
const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function hasDeliverTo(req, res, next) {
    const { data: { deliverTo } = {} } = req.body;
  
    if (deliverTo) {
      return next();
    }
    next({ status: 400, message: "Order must include a deliverTo." });
  }
  
  function hasMobileNumber(req, res, next) {
    const { data: { mobileNumber } = {} } = req.body;
  
    if (mobileNumber) {
      return next();
    }
    next({ status: 400, message: "Order must include a mobileNumber." });
  }

  function hasStatus(req, res, next) {
    const { data: { status } = {} } = req.body;
  
    if (status && (status == "pending" || status == "preparing" || status == "out-for-delivery" || status == "delivered")) {
      return next();
    }
    next({ status: 400, message: "Order must include a status." });
  }

  function hasDishes(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    //console.log("DISHES LENGTH: ", dishes.length)
    if (dishes != undefined && dishes instanceof Array && dishes.length >= 1) {
      return next();
    }
    next({ status: 400, message: "Order must include a dishes." });
  }
  
  function hasQuantity(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    let currentIndex = 0;
    let index = -1;
    dishes.forEach((dish) => {
        if(dish.quantity === undefined || !Number.isInteger(dish.quantity) || dish.quantity <=0) {
            index=currentIndex;
        }
        currentIndex++;
    });

    if (index == -1) {
      return next();
    }
    next({ status: 400, message: `Dish ${index} must have a quantity that is an integer greater than 0` });
  }
  
  function orderExists(req, res, next) {
    const orderId = req.params.orderId;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
      res.locals.order = foundOrder
      return next();
    }
    next({
      status: 404,
      message: `Order does not exist: ${orderId}.`,
    });
  }
  

  /*function idMatchesPut(req, res, next) {
    const dishId = req.params.dishId;
    const { data: { id } = {} } = req.body;
  
    if (dishId == id) {
      return next();
    }
    next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}` });
  }
  */
  
  
  function create(req, res) {
    const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
  
      const newOrder = {
        id: nextId(),
        deliverTo: deliverTo,
        mobileNumber: mobileNumber,
        status: "pending",
        dishes: dishes,
      };
      orders.push(newOrder);
      res.status(201).json({ data: newOrder });
    }
  
    function list(req, res) {
      res.json({ data: orders });
    }
  
    function read(req, res) {
      //const orderId = req.params.orderId;
      //const foundOrder = orders.find((order) => (order.id = orderId));
      foundOrder = res.locals.order;
      res.json({ data: foundOrder });
    }
    
    function update(req, res, next) {
      const orderId = req.params.orderId;
      const { data: { deliverTo, mobileNumber, dishes, status, id } = {} } = req.body;
      const order = res.locals.order;

      if (id && order.id !== id) {
        return next({ status: 400, message: `Order id does not match route id. Dish: ${id}, Route: ${order.id}` });
      }

      order.deliverTo = deliverTo;
      order.mobileNumber = mobileNumber;
      order.dishes = dishes;
      order.status = status;
  
      res.status(200).json({ data: order });
    }
  
  
    function destroy(req, res, next) {
        const { orderId } = req.params;
        const index = orders.findIndex((order) => order.id === orderId);

        if(orders[index].status != "pending"){ 
            next({ status: 400, message: `An order cannot be deleted unless it is pending.` });
        }else{

        if (index > -1) {
          orders.splice(index, 1);
          res.sendStatus(204);
        }
        else{
            res.sendStatus(404)
        }
        }
    
      }

  
  module.exports = {
    create: [hasDeliverTo, hasMobileNumber, hasDishes, hasQuantity, create],
      list: list,
      read: [orderExists, read],
      update: [orderExists, hasStatus, hasDeliverTo, hasMobileNumber, hasDishes, hasQuantity, update],
      delete: [orderExists, destroy],
    };
    