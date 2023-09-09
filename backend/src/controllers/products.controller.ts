import productsService from '../services/products.service';
import { Request, Response } from 'express';
import { serializeBigInt } from '../utils/serializeBigInt';
import { ProductsFromRequest } from '../protocols';

async function read(req: Request, res: Response) {
  const { codes } = req.query as Record<string, string>;

  const data = await productsService.read(codes);
  res.status(200).json(data);
}

async function readOne(req: Request, res: Response) {
  const { id } = req.params as Record<string, string>;

  const product = await productsService.readOne(+id);

  const data = serializeBigInt(product);
  res.status(200).json(JSON.parse(data));
}

async function readAndValidate(req: Request, res: Response) {
  try {
    const body = req.body as UpdateBodyParams;
    const data = await productsService.readProductsAndValidate(body);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

async function update(req: Request, res: Response) {
  try {
    const body = req.body as UpdateBodyParams;
    const data = await productsService.update(body);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

export type UpdateBodyParams = {
  products: ProductsFromRequest[];
};

export default {
  readOne,
  readAndValidate,
  read,
  update,
};
