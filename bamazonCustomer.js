// Pull in required dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');

// Define the MySQL connection parameters
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	// Your username
	user: 'root',

	// Your password
	password: '',
	database: 'bamazon'
});


function start(){
    //prints the items for sale and their details
    connection.query('SELECT * FROM products', function(err, res){
      if(err) throw err;
    
      console.log('+-+-+-+-+-+- Welcome to Bamazon -+-+-+-+-+-+')
      console.log('----------------------------------------------------------------------------------------------------')
    
      for(var i = 0; i<res.length;i++){
        console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: " + res[i].price + " | " + "QTY: " + res[i].stock_quantity);
        console.log('--------------------------------------------------------------------------------------------------')
      }
    
      console.log(' ');
      inquirer.prompt([
        {
          type: "input",
          name: "id",
          message: "What is the ID of the product you would like to purchase?",
          validate: function(value){
            if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
              return true;
            } else{
              return false;
            }
          }
        },
        {
          type: "input",
          name: "qty",
          message: "How much would you like to purchase?",
          validate: function(value){
            if(isNaN(value)){
              return false;
            } else{
              return true;
            }
          }
        }
        ]).then(function(ans){
          var whatToBuy = (ans.id)-1;
          var howMuchToBuy = parseInt(ans.qty);
          var grandTotal = parseFloat(((res[whatToBuy].price)*howMuchToBuy).toFixed(2));
    
          //check if quantity is sufficient
          if(res[whatToBuy].stock_quantity >= howMuchToBuy){
            //after purchase, updates quantity in products
            connection.query("UPDATE products SET ? WHERE ?", [
            {stock_quantity: (res[whatToBuy].stock_quantity - howMuchToBuy)},
            {item_id: ans.id}
            ], function(err, result){
                if(err) throw err;
                console.log("Success! Your total is $" + grandTotal.toFixed(2) + ". Your item(s) will be shipped to you in 3-5 business days.");
                }
            )};
    
// I'm not sure what I'm missing to make my app run. 
// I kept getting frustrated and had to submit what I completed up to this point.