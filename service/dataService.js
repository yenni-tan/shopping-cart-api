const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

function dataService() {
  // Set some defaults (required if your JSON file is empty)
  db.defaults(
    { cartItems: [], 
      availableItems: [
        {
          id: 1,
          name: 'puppy',
          quantity: 1,
          price: 100,
          img: 'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/12231413/Labrador-Retriever-MP.jpg'
        },
        {
          id: 2,
          name: 'duck',
          quantity: 1,
          price: 200,
          img: 'https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr06/2013/5/29/10/enhanced-buzz-12625-1369837568-0.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto'
        },
        {
          id: 3,
          name: 'fox',
          quantity: 1,
          price: 150,
          img: 'https://i.redd.it/9bt1q8hey8j21.jpg'
        },
        
      ] 
    }).write();
}

dataService.prototype.getCartItems = function getCartItems() {
    const items = db.get('cartItems').value();
    return items;
}

dataService.prototype.getAvailableItems = function getCartItems() {
  const items = db.get('availableItems').value();
  return items;
}

dataService.prototype.addCartItem = function addCartItem(items) {
  for (item of items) {
      // check if item already exists in cart
    const itemInCart = 
      db.get('cartItems')
        .find({ id: item.id }).value();
    if (itemInCart) {
      db.get('cartItems')
        .find({ id: item.id })
        .assign({ 
          name: item.name,
          quantity: itemInCart.quantity + item.quantity,
          price: item.price,
          id: item.id
        })
        .write();
    } else {
      db.get('cartItems')
        .push(item)
        .write();
    }
  // if it does, updated quantity
  // else add new item
    
  }
}

dataService.prototype.updateCartItem = function updateCartItem(item) {
  const itemInCart = 
    db.get('cartItems')
      .find({ id: item.id }).value();
  if (itemInCart) {
    if (parseInt(item.quantity) === 0) {
      db.get('cartItems')
          .remove({ id: item.id })
          .write();
    } else {
      const updatedItem = { 
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        id: item.id
      };
      db.get('cartItems')
          .find({ id: item.id })
          .assign(updatedItem)
          .write();
    }
  }
}

module.exports = dataService;