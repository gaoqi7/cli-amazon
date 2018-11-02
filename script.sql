create table departments
(
  department_id   int auto_increment
    primary key,
  department_name varchar(30)    not null,
  over_head_costs decimal(11, 2) null
);

create table products
(
  item_id         int auto_increment
    primary key,
  product_name    varchar(30)                   not null,
  department_name varchar(30)                   not null,
  price           decimal(6, 2)                 not null,
  stock_quantity  int(5)                        null,
  product_sales   decimal(11, 2) default '0.00' null
);


