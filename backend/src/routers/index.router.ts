import { Router } from "express";
import { productsRouter } from "./products.router";
// You can add more routes but don't change this comment (import)

const IndexRouter = Router();

IndexRouter.use(productsRouter)
// You can add more routes but don't change this comment (index)

export default IndexRouter