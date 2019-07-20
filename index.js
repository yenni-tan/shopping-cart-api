const express = require('express');
const app = express();
const port = 3000;

const DataService = require('./service/dataService');

const httpStatus = require('http-status-codes');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/api/cart-items', (req, res) => {
  const dataService = new DataService();
  const cartItems = dataService.getCartItems();
  res.status = httpStatus.OK;
  res.send({
    items: cartItems
  });
});

app.get('/api/available-items', (req, res) => {
  const dataService = new DataService();
  const availableItems = dataService.getAvailableItems();
  res.status = httpStatus.OK;
  res.send({
    items: availableItems
  });
});

app.post('/api/cart-item', (req, res) => {
  const dataService = new DataService();
  if(!req.body) {
    const error = new Error();
    error.status = httpStatus.BAD_REQUEST;
    error.message = 'Cart Item data must be included to add a cart item.';
    throw error;
  }
  dataService.addCartItem(req.body);

  res.status(httpStatus.CREATED);
  res.send(`added item: ${req.body}`);
  
});

app.put('/api/cart-item/:id', (req, res) => {
  const dataService = new DataService();
  if(!req.body || !req.params || !req.params.id) {
    const error = new Error();
    error.status = httpStatus.BAD_REQUEST;
    error.message = 'Cart Item cannot be updated without id';
    throw error;
  }
  dataService.updateCartItem(req.body);

  res.status(httpStatus.OK);
  // res.send(`updated item: ${req.body}`);
  res.send();
});

app.use((err, req, res, next) => {
    if (err.statusCode === httpStatus.NOT_FOUND) {
      error.status = httpStatus.INTERNAL_SERVER_ERROR;
      error.message = 'An unexpected error occurred.';
    }
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.send();
});

app.listen(port, () => {
    console.log('listening on http://localhost:3000');
});