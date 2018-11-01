var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "woaiwojia8",
  database: "bamazon_db"
});
function viewProductForSale() {
  connection.query(
    "SELECT item_id,product_name,price,stock_quantity FROM products",
    (err, res) => {
      if (err) throw err;
      console.log(res);
      connection.end();
    }
  );
}
function viewLowInventory() {
  connection.query(
    "SELECT * FROM products WHERE stock_quantity < ?",
    [70],
    (err, res) => {
      if (err) throw err;

      if (res.length === 0) {
        console.log("all good");
      } else {
        console.log(res);
      }
      connection.end();
    }
  );
}
function addToInventory() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Input the item's ID that you want to add to",
        name: "chosenId"
      },
      {
        type: "input",
        message: "Input the quantity that you want to add",
        name: "addOn"
      }
    ])
    .then(res => {
      connection.query(
        "SELECT stock_quantity FROM products WHERE ?",
        [{ item_id: res.chosenId }],
        (err, data) => {
          let b = data[0].stock_quantity;
          console.log(b);
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              { stock_quantity: parseInt(res.addOn) + b },
              { item_id: res.chosenId }
            ],
            err => {
              if (err) throw err;
              connection.end();
            }
          );
        }
      );
    });
}

function addNewProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Input the new product name",
        name: "productName"
      },
      {
        type: "input",
        message: "Input your department name",
        name: "departmentName"
      },
      {
        type: "input",
        message: "Input the new product's price",
        name: "salePrice"
      },
      {
        type: "input",
        message: "Input the new product's stock quantity",
        name: "quantity"
      }
    ])
    .then(res => {
      connection.query(
        "INSERT INTO products(product_name,department_name,price,stock_quantity) VALUES(?,?,?,?)",
        [res.productName, res.departmentName, res.salePrice, res.quantity],
        err => {
          if (err) throw err;
          console.log("New product added successfully");
          connection.end();
        }
      );
    });
}

inquirer
  .prompt([
    {
      name: "option",
      type: "list",
      message: "what do you want to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    }
  ])
  .then(res => {
    console.log(res.option);
    if (res.option === "View Products for Sale") {
      viewProductForSale();
    }
    if (res.option === "View Low Inventory") {
      viewLowInventory();
    }
    if (res.option === "Add to Inventory") {
      addToInventory();
    }
    if (res.option === "Add New Product") {
      addNewProduct();
    }
  });
