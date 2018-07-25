module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {}; //! Firstly create a js-object - om det inte finns startar ett tomt object
    this.totalQty = oldCart.totalQty || 0; //! Firstly create a js-object - om det inte finns sätt kvantitet till 0
    this.totalPrice = oldCart.totalPrice || 0;

    //*Function to add a new item to the cart
    this.add = function(item, id) {
        var storedItem = this.items[id];    //! Sparar först id.t 
        if (!storedItem) {                  //! Kollar om produkten redan finns sparad
            storedItem = this.items[id] = {item: item, qty: 0, price: 0}; //!Lägger till det nya item:et
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0) { //! Tag bort i det fallet då vi ej har några av den sorten är borta
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    //! Needed in order to generate a list from the item-object -> show the product groups
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};