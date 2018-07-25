var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    res.render('shop/index', {title: 'Shopping Cart',successMsg: successMsg, noMessages: !successMsg});
});

router.get('/products', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, products) {
        res.render('shop/products', {title: 'Shopping Cart', products: products, successMsg: successMsg, noMessages: !successMsg});
    });
});

router.get('/about', function(req, res, next) {
    res.render('shop/about')
})

router.get('/contact', function(req, res, next) {
    res.render('shop/contact')
})

router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {}); 
    //! Skapar ny cart från cart.js - om req.session.cart finns redan cart - skickar tomt object
    console.log(cart)

    Product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/'); //! Bör ändras för att ge felmeddelande
       }
        cart.add(product, product.id); //! 
        req.session.cart = cart;
        res.redirect('/products');
    });
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('user/signin', {products: null});
   } 
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg}); //! Skicka med noError: !errMsg då det kollas i checkout.hbs
});

router.post('/checkout', isLoggedIn, function(req, res, next) { //! Måste vara inloggad för att få checka out
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    
    var stripe = require("stripe")(
        "sk_test_61wJwYDwDC2iANUYjKs3txen"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100, //! *100 för att få det i dollar
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        //! Order kommer alltså ifrån order.js-model
        var order = new Order({
            user: req.user, //! Kommer ifrån passport, så fort man är inloggad
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            //TODO Behöver hantera error här
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/user/profile');
        });
    }); 
});


module.exports = router;

//! Middleware for checking logged in user
//! I Yelpcamp ligger den som en separat route
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url; //! För att skicka användaren tillbaka till url:en där usern kommer ifrån
    res.redirect('/user/signin');
}
