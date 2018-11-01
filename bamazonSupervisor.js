var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "woaiwojia8",
  database: "bamazon_db"
});

function addNewDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Input new department name",
        name: "departmentName"
      },
      {
        type: "input",
        message: "Estimate the new department over-head-cost",
        name: "overHeadCosts"
      }
    ])
    .then(res => {
      connection.query(
        "INSERT INTO products(department_name,over_head_costs) VALUES(?,?)",
        [res.departmentName, res.overHeadCosts],
        err => {
          if (err) throw err;
          console.log("Add new department successfully");
          connection.end();
        }
      );
    });
}

function viewSalePerDep() {
  connection.query(
    "SELECT departments.*,SUM(products.product_sales) as total_sales FROM departments,products WHERE departments.department_name = products.department_name GROUP BY departments.department_name,departments.department_id,departments.over_head_costs",
    (err, res) => {
      if (err) throw err;
      let hello = [];
      res.forEach(element => {
        element.total_profit = element.total_sales - element.over_head_costs;
        hello.push(element);
      });
      console.table(hello);
      connection.end();
    }
  );
}
viewSalePerDep();
