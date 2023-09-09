import { Router } from 'express';
import productsController from '../controllers/products.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { updateProductBodySchema } from '../schemas/products.schema';

const productsRouter = Router();

productsRouter.get('/products', productsController.read);
productsRouter.post(
  '/products/validate',
  validateBody(updateProductBodySchema),
  productsController.readAndValidate,
);

productsRouter.put(
  '/products',
  validateBody(updateProductBodySchema),
  productsController.update,
);

export { productsRouter };
