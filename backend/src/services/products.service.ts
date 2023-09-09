import productsRepository, {
  ProductsWithPack,
} from '../repositories/products.repository';
import { UpdateBodyParams } from '../controllers/products.controller';
import { serializeBigInt } from '../utils/serializeBigInt';
import { TableProduct, ProductDB, ProductsFromRequest } from '../protocols';
import { noContent } from '../errors/noContent.error';
import pool from '../configs/database';

let invalidProducts: TableProduct[] = [];
let validProducts: ValidProducts[] = [];

export type ValidProducts = Omit<TableProduct, 'error'>;

async function read(codes: string) {
  const dbProducts = await productsRepository.list(codes);

  if (dbProducts.length === 0) {
    throw noContent();
  }

  return dbProducts;
}

async function readOne(id: number) {
  const product = await productsRepository.listOne(id);
  return product;
}

async function readProductsAndValidate(body: UpdateBodyParams) {
  const con = await pool;
  const { products } = body;
  invalidProducts = [];
  validProducts = [];

  await con.beginTransaction();
  try {
    for (let { code, new_price } of products) {
      if (Number(code) >= 1000) {
        await handlePackProductsUpdate(+code, +new_price, products);
        continue;
      }
      await handleProductValidate(+code, +new_price, products);
    }
    await con.commit();
    return [...validProducts, ...invalidProducts];
  } catch (error) {
    await con.rollback();
    return error;
  }
}

async function update(body: UpdateBodyParams) {
  const con = await pool;
  const { products } = body;

  await con.beginTransaction();
  try {
    for (let { code, new_price } of products) {
      await productsRepository.update(code, new_price);
    }

    await con.commit();
  } catch (error) {
    await con.rollback();
    return error;
  }
}

async function handlePackProductsUpdate(
  code: number,
  newPrice: number,
  productsFromRequest: ProductsFromRequest[],
) {
  const productsInDatabase =
    await productsRepository.listProductsByPackId(code);

  const productsThatArePartOfPack = productsFromRequest.filter(
    (productFromRequest) =>
      productsInDatabase.some(
        (productInDb) =>
          productInDb.product_code === Number(productFromRequest.code),
      ),
  );

  const firstProductWithPack = productsInDatabase[0];

  if (productsThatArePartOfPack.length === 0) {
    handleInvalidPackUpdate(
      code.toString(),
      firstProductWithPack,
      `ERRO! Não foi possível atualizar o pacote pois faltavam ajustes dos produtos deste pacote`,
    );
    return;
  }

  if (
    productsThatArePartOfPack.length === 1 &&
    !validateProductInPackUpdate(
      productsThatArePartOfPack[0],
      productsInDatabase,
      newPrice,
    )
  ) {
    handleInvalidPackUpdate(
      code.toString(),
      firstProductWithPack,
      `ERRO! Não foi possível atualizar o pacote porque o reajuste do 
      produto com código: ${productsThatArePartOfPack[0].code} não é válido, ou porque você deve fornecer outro produto que complemente o preço deste pacote`,
    );
    return;
  }

  if (
    productsThatArePartOfPack.length > 1 &&
    !validatePackUpdate(productsThatArePartOfPack, newPrice, productsInDatabase)
  ) {
    handleInvalidPackUpdate(
      code.toString(),
      firstProductWithPack,
      `ERRO! Não foi possível atualizar o pacote porque o reajuste dos produtos não é válido.`,
    );
    return;
  }

  if (isBellowCostPrice(+firstProductWithPack.pack_cost_price, newPrice)) {
    handleInvalidPackUpdate(
      code.toString(),
      firstProductWithPack,
      `O preço de venda não pode ser definido abaixo do preço de custo. 
    Ajuste o preço de acordo para garantir que ele cubra o custo. preço de custo: ${firstProductWithPack.pack_cost_price}`,
    );
    return;
  }
  const [productOldValues] = await productsRepository.listOne(code);

  validProducts.push({
    code: productOldValues.code.toString(),
    name: productOldValues.name,
    old_price: productOldValues.sales_price,
    new_price: newPrice.toFixed(2),
  });
}

function validateProductInPackUpdate(
  productFromRequest: ProductsFromRequest,
  productsInDatabase: ProductsWithPack[],
  newPrice: number,
) {
  const productThatCompletesPack = productsInDatabase.find(
    (productFromDB) =>
      productFromDB.product_code !== Number(productFromRequest.code),
  );

  if (productThatCompletesPack) {
    const sumOfProductRequestAndCompletingProduct =
      Number(productThatCompletesPack.product_sales_price) +
      Number(productFromRequest.new_price);
    return sumOfProductRequestAndCompletingProduct === newPrice;
  }

  const productInPack = productsInDatabase.find(
    (productInDb) =>
      productInDb.product_code === Number(productFromRequest.code),
  );

  const isProductFromRequestPriceValid =
    newPrice / productInPack.qty === Number(productFromRequest.new_price);

  return isProductFromRequestPriceValid;
}

function validatePackUpdate(
  products: ProductsFromRequest[],
  newPrice: number,
  productsInDb: ProductsWithPack[],
) {
  const sumOfProductsPrice = products.reduce((accumulator, product) => {
    const getProductRequestFromProductsInDb = productsInDb.find(
      (productInDb) => productInDb.product_code === Number(product.code),
    );
    return (accumulator +=
      Number(product.new_price) * getProductRequestFromProductsInDb.qty);
  }, 0);

  return sumOfProductsPrice.toFixed(2) === newPrice.toFixed(2);
}

function handleInvalidPackUpdate(
  code: string,
  packName: ProductsWithPack,
  errorMessage: string,
) {
  invalidProducts.push(
    buildError(
      code,
      packName.pack_name,
      packName.pack_sales_price,
      packName.pack_sales_price,
      errorMessage,
    ),
  );
}

async function handleProductValidate(
  code: number,
  new_price: number,
  products: ProductsFromRequest[],
) {
  const [product]: ProductDB[] = JSON.parse(
    serializeBigInt(await productsRepository.listOne(code)),
  );

  if (!product) {
    invalidProducts.push(
      buildError(
        'not found',
        'not found',
        'not found',
        'not found',
        `ID do código não encontrado, verifique o seu banco de dados. ID do código fornecido: ${code}`,
      ),
    );
    return;
  }

  const productsWithInvalidRule = await validatePriceRulesForProduct(
    product,
    new_price,
  );

  const isPackInRequest = await checkIfPackInRequest(code, new_price, products);

  if (productsWithInvalidRule.length > 0 || !isPackInRequest) {
    invalidProducts.push(...productsWithInvalidRule);
    return;
  }

  validProducts.push({
    code: product.code.toString(),
    name: product.name,
    old_price: product.sales_price,
    new_price: new_price.toFixed(2),
  });
}

async function validatePriceRulesForProduct(
  productInDB: ProductDB,
  newPrice: number,
) {
  const { code, name, cost_price, sales_price } = productInDB;
  const productsWithInvalidRule: TableProduct[] = [];

  if (isBellowCostPrice(cost_price, newPrice)) {
    productsWithInvalidRule.push(
      buildError(
        code.toString(),
        name,
        sales_price,
        sales_price,
        `O preço de venda não pode ser inferior ao preço de custo. 
        Ajuste o preço de acordo para garantir que ele cubra o custo. preço de custo: ${cost_price}, reajuste fornecido: ${newPrice}`,
      ),
    );
    return productsWithInvalidRule;
  }

  if (!isWithinTenPercentDifference(+productInDB.sales_price, +newPrice)) {
    productsWithInvalidRule.push(
      buildError(
        code.toString(),
        name,
        sales_price,
        sales_price,
        'O reajuste de preços ultrapassa o limite de 10%. Certifique-se de que o novo preço esteja dentro de 10% do preço atual.',
      ),
    );
    return productsWithInvalidRule;
  }

  return productsWithInvalidRule;
}

function isWithinTenPercentDifference(currentPrice: number, newPrice: number) {
  const valorAtual = currentPrice;
  const novoValor = newPrice;
  const MAX_PERCENTUAL = 100;

  const percentualReduzido = Math.abs(
    (novoValor * MAX_PERCENTUAL) / valorAtual - MAX_PERCENTUAL,
  );

  return percentualReduzido < 10;
}

function isBellowCostPrice(costPrice: number, newPrice: number) {
  return newPrice < costPrice;
}

async function checkIfPackInRequest(
  code: number,
  productNewPrice: number,
  productsFromRequest: ProductsFromRequest[],
) {
  const packInDatabaseByProductId =
    await productsRepository.listPackFromProductId(code);

  const productFromRequestInDatabase = packInDatabaseByProductId.find(
    (product) => {
      return +code === +product.product_code;
    },
  );

  if (!productFromRequestInDatabase) return true;

  const productThatCompletesPack = packInDatabaseByProductId.find((product) => {
    return +code !== product.product_code;
  });

  const productFromRequestPriceWithQuantity =
    productNewPrice * productFromRequestInDatabase.qty;

  const productThatCompletesPackPriceWithQuantity = productThatCompletesPack
    ? +productThatCompletesPack.product_sales_price *
      productThatCompletesPack.qty
    : 0;

  const priceThatPackMustHave =
    productThatCompletesPackPriceWithQuantity +
    productFromRequestPriceWithQuantity;

  const isPackReadjustmentInRequest = productsFromRequest.find((product) => {
    return +product.code === +packInDatabaseByProductId[0].pack_code;
  });

  if (priceThatPackMustHave !== +isPackReadjustmentInRequest?.new_price) {
    invalidProducts.push(
      buildError(
        code.toString(),
        productFromRequestInDatabase.product_name,
        productFromRequestInDatabase.product_sales_price,
        productFromRequestInDatabase.product_sales_price,
        `ERROR: Para atualizar este produto é necessário ter também no arquivo o pacote com o seu reajuste.
        Este é o código do pacote que você deve atualizar: ${
          productFromRequestInDatabase.pack_code
        }, novo preço inserido: ${productNewPrice}, preço que o pacote deve ter: ${priceThatPackMustHave.toFixed(
          2,
        )}`,
      ),
    );
    return;
  }

  return true;
}

function buildError(
  code: string,
  name: string,
  old_price: string | number,
  new_price: string | number,
  error: string,
): TableProduct {
  return {
    code,
    name,
    old_price,
    new_price,
    error,
  };
}

export default {
  readOne,
  readProductsAndValidate,
  read,
  update,
};
