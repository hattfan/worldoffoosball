var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/foosballshopping');

var products = [
    new Product({
        imagePath: 'images/product-01.jpg',
        title: 'Protable',
        description: 'Game for championship tournaments',
        price: 499
    }),
    new Product({
        imagePath: 'images/product-02.jpg',
        title: 'Midtable',
        description: 'For your everyday workfun',
        price: 399
    }),
    new Product({
        imagePath: 'images/product-03.jpg',
        title: 'Lighttable',
        description: 'For the weekend warrior tournaments',
        price: 299
    }),
    new Product({
        imagePath: 'images/product-04.jpg',
        title: 'Balls',
        description: 'A 3-pack of high quality balls',
        price: 39
    }),
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        console.log('Inputted')
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}