var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
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
  connection.query(
    "SELECT item_id ID,product_name NAME,price PRICE FROM products",
    function(err, data) {
      if (err) throw err;
      console.table(data);
      buy();
    }
  );
}
function buy() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please input the ID of the product you would like to buy: ",
        name: "chosenID"
      },
      {
        type: "input",
        message: "how many units of the product you would like to buy? ",
        name: "quantity"
      }
    ])
    .then(customerResponse => {
      var resId = customerResponse.chosenID;
      var resQty = customerResponse.quantity;

      connection.query(
        "SELECT stock_quantity FROM products WHERE ?",
        [{ item_id: resId }],
        (err, res) => {
          if (err) throw err;
          if (resQty <= res[0].stock_quantity) {
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                { stock_quantity: res[0].stock_quantity - resQty },
                { item_id: resId }
              ],
              err => {
                if (err) throw err;
                moneyIn(resId, resQty);
              }
            );
          } else {
            console.log(
              "Dear Customer: the item that you choose is so popular, we only have %i in stock",
              res[0].stock_quantity
            );
            inquirer
              .prompt([
                {
                  type: "list",
                  message: "Do you want to take them all?",
                  name: "isContinue",
                  choices: ["YES", "NO"]
                }
              ])
              .then(ans => {
                if (ans.isContinue === "NO") {
                  console.log(
                    "Please accept our apologies for this inconvenience, Have a nice day!"
                  );
                  connection.end();
                } else if (ans.isContinue === "YES") {
                  connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{ stock_quantity: 0 }, { item_id: resId }],
                    err => {
                      if (err) throw err;
                      moneyIn(resId, res[0].stock_quantity);
                    }
                  );
                }
              });
          }
        }
      );
    });
}
function moneyIn(i, j) {
  connection.query(
    "SELECT price FROM products WHERE ?",
    [{ item_id: i }],
    (err, res) => {
      if (err) throw err;
      let p = res[0].price;
      connection.query(
        "SELECT product_sales FROM products WHERE ?",
        [{ item_id: i }],
        (err, profit) => {
          if (err) throw err;
          let moneyHave = profit[0].product_sales;
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{ product_sales: moneyHave + p * j }, { item_id: i }],
            err => {
              if (err) throw err;
              console.log("Thanks for your business, total cost is %f.", p * j);

              inquirer
                .prompt([
                  {
                    name: "thatAll",
                    message: "Anything else?",
                    type: "list",
                    choices: ["YES", "NO"]
                  }
                ])
                .then(res => {
                  if (res.thatAll === "YES") {
                    buy();
                  } else if (res.thatAll === "NO") {
                    console.log("Thanks for your shopping.Have a nice day!");
                    connection.end();
                  }
                });
              // connection.end();
            }
          );
        }
      );
    }
  );
}
