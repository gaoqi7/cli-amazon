var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "woaiwojia8",
  database: "bamazon_db"
});
connection.connect(err => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});
function afterConnection() {
  connection.query("SELECT item_id,product_name,price FROM products", function(
    err,
    data
  ) {
    if (err) throw err;
    console.log(data);
    // connection.end();
    inquirer
      .prompt([
        {
          type: "input",
          message: "Please input the ID of the product they would like to buy",
          name: "chosenID"
        },
        {
          type: "input",
          message: "how many units of the product you would like to buy?",
          name: "quantity"
        }
      ])
      .then(customerResponse => {
        //   if(customerResponse.quantity<=){}
        buy(customerResponse.chosenID, customerResponse.quantity);
        console.log(customerResponse.chosenID);
        console.log(customerResponse.quantity);
      });
  });
}
function buy(i, j) {
  connection.query(
    "SELECT stock_quantity FROM products WHERE ?",
    [{ item_id: i }],
    (err, res) => {
      if (err) throw err;
      console.log(res);

      if (j <= res[0].stock_quantity) {
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [{ stock_quantity: res[0].stock_quantity - j }, { item_id: i }],
          err => {
            if (err) throw err;
            moneyIn(i, j);
          }
        );
      } else {
        console.log("we don't have that much!");
        connection.end();
      }
    }
  );
}
function moneyIn(i, j) {
  connection.query(
    "SELECT price FROM products WHERE ?",
    [{ item_id: i }],
    (err, res) => {
      if (err) throw err;
      let p = res[0].price;
      connection.query(
        "UPDATE products SET ? WHERE ?",
        [{ product_sales: p * j }, { item_id: i }],
        err => {
          if (err) throw err;
          console.log(
            "Thanks for your business, total cost is %f. Have a nice day!",
            p * j
          );
          connection.end();
        }
      );
    }
  );
}
