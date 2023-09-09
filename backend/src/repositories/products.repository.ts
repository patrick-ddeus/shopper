import pool from '../configs/database';
import { ProductDB } from '../protocols';
import { Connection } from 'mysql2';

async function list(codes?: string) {
  const args = [];

  let sql = `SELECT code, name, cost_price, sales_price FROM products WHERE TRUE`;

  if (codes) {
    sql += ` AND code IN (?)`;
    args.push(codes.split(','));
  }

  const con = await pool;

  const [rows] = await con.query(sql, args);

  return rows as ProductDB[];
}

async function listOne(id: number) {
  const sql = `
  SELECT code, name, cost_price, sales_price FROM products WHERE code = ?
  `;
  const con = await pool;

  const [rows] = await con.execute(sql, [id]);

  return rows as ProductDB[];
}

async function listProductsByPackId(packId: number) {
  const sql = `
  SELECT p1.code as pack_code, p1.name as pack_name, p1.cost_price as pack_cost_price, p1.sales_price as pack_sales_price, 
  p2.code AS product_code, p2.name AS product_name, 
  p2.cost_price AS product_cost_price, p2.sales_price AS product_sales_price, pa.qty
  FROM packs pa
  JOIN products p1 ON pa.pack_id = p1.code
  JOIN products p2 ON pa.product_id = p2.code
  WHERE pa.pack_id = ?;
  `;
  const con = await pool;

  const [rows] = await con.execute(sql, [packId]);

  return rows as ProductsWithPack[];
}

async function listPackFromProductId(productId: number) {
  const sql = `
  SELECT p1.code AS pack_code, p1.name AS pack_name, p1.cost_price AS pack_cost_price, p1.sales_price AS pack_sales_price, 
       p2.code AS product_code, p2.name AS product_name, 
       p2.cost_price AS product_cost_price, p2.sales_price AS product_sales_price, pa.qty
  FROM packs pa
  JOIN products p1 ON pa.pack_id = p1.code
  JOIN products p2 ON pa.product_id = p2.code
  WHERE p1.code = (
    SELECT pack_id
    FROM packs
    WHERE product_id = ?
  );
  `;
  const con = await pool;

  const [rows] = await con.execute(sql, [productId]);

  return rows as ProductsWithPack[];
}

async function update(code: string | number, newPrice: string | number) {
  const con = await pool;

  const sqlToUpdate = `
    UPDATE products
    SET sales_price = ?
    WHERE code = ?;
    `;

  const [rows] = await con.execute(sqlToUpdate, [newPrice, code]);
  await con.commit();

  return rows;
}

async function remove() {
  return 'removed data';
}

export type ProductsWithPack = {
  pack_code: string;
  pack_name: string;
  pack_cost_price: string;
  pack_sales_price: string;
  product_code: number;
  product_name: string;
  product_cost_price: string;
  product_sales_price: string;
  qty: number;
};

export default {
  list,
  listOne,
  listProductsByPackId,
  listPackFromProductId,
  update,
  remove,
};
