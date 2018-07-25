var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'}, //! Sparar id:t men refererar det till User modelen
    cart: {type: Object, required: true}, //! Sparar hela carten som ett object
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true} //! Kommer ifrån Stripe
});

module.exports = mongoose.model('Order', schema);