import Joi from 'joi';
import { ProductsFromRequest } from '../protocols';

const ProductToUpdateSchema = {
  code: Joi.string().required(),
  new_price: Joi.string().required(),
};

export type UpdateProductBodySchemaType = {
  products: ProductsFromRequest[];
};

export const updateProductBodySchema = Joi.object<UpdateProductBodySchemaType>({
  products: Joi.array().items(Joi.object(ProductToUpdateSchema)).required(),
});
