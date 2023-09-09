import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { init } from '../../src/app';

beforeAll(async () => {
  await init();
});

const server = supertest(app);

describe('GET /products/validate', () => {
  describe('should respond with status 400', () => {
    it('when body is missing', async () => {
      const response = await server.post('/products/validate');

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('when body is invalid', async () => {
      const response = await server.post('/products/validate').send({
        products: [true, false],
      });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  describe('Tests for Packs', () => {
    describe('should respond with status 200', () => {
      it('and ERROR message when user tries to update a pack without products from pack', async () => {
        const response = await server.post('/products/validate').send({
          products: [
            {
              code: '1010',
              new_price: '11.00',
            },
          ],
        });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              error:
                'ERRO! Não foi possível atualizar o pacote pois faltavam ajustes dos produtos deste pacote',
            }),
          ]),
        );
      });

      it('and ERROR message when user tries to update a pack that contains one product and it has invalid readjustment price', async () => {
        const products = [
          {
            code: '1000',
            new_price: '54.00',
          },
          {
            code: '18',
            new_price: '9.2',
          },
        ];
        const response = await server.post('/products/validate').send({
          products,
        });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              error: `ERRO! Não foi possível atualizar o pacote porque o reajuste do produto com código: ${products[1].code} não é válido, ou porque você deve fornecer outro produto que complemente o preço deste pacote`,
            }),
          ]),
        );
      });

      it('and ERROR message when user tries to update a pack with two or more products and they have invalid readjustment price', async () => {
        const products = [
          {
            code: '1010',
            new_price: '10.05',
          },
          {
            code: '24',
            new_price: '4.0',
          },
          {
            code: '26',
            new_price: '6.0',
          },
        ];
        const response = await server.post('/products/validate').send({
          products,
        });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              error: `ERRO! Não foi possível atualizar o pacote porque o reajuste dos produtos não é válido.`,
            }),
          ]),
        );
      });

      it('and ERROR message when user tries to update a pack with newPrice below cost price', async () => {
        const packInformations = {
          code: '1010',
          cost_price: '8.80',
        };

        const products = [
          {
            code: '1010',
            new_price: '8.70',
          },
          {
            code: '24',
            new_price: '3.7',
          },
          {
            code: '26',
            new_price: '5.0',
          },
        ];
        const response = await server.post('/products/validate').send({
          products,
        });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              error: `O preço de venda não pode ser definido abaixo do preço de custo. Ajuste o preço de acordo para garantir que ele cubra o custo. preço de custo: ${packInformations.cost_price}`,
            }),
          ]),
        );
      });
    });
  });

  describe('Tests for Products', () => {
    describe('should respond with status 200', () => {
      it('and ERROR message when user tries to update a product with code that doesnt exists', async () => {
        const products = [{ code: '700', new_price: '20' }];
        const response = await server.post('/products/validate').send({
          products,
        });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              error: `ID do código não encontrado, verifique o seu banco de dados. ID do código fornecido: ${products[0].code}`,
            }),
          ]),
        );
      });

      it('and ERROR message when user tries to update a product with newPrice below cost price', async () => {
        const productInDb = {
          code: '22',
          cost_price: '6.74',
        };

        const products = [
          {
            code: '22',
            new_price: '6.73',
          },
        ];
        const response = await server.post('/products/validate').send({
          products,
        });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              error: `O preço de venda não pode ser inferior ao preço de custo. Ajuste o preço de acordo para garantir que ele cubra o custo. preço de custo: ${productInDb.cost_price}, reajuste fornecido: ${products[0].new_price}`,
            }),
          ]),
        );
      });

      it('and ERROR message when user tries to update a product with new_price out of 10% of the current price', async () => {
        const productInDb = {
          code: '16',
          cost_price: '18.44',
        };

        const products = [
          {
            code: '16',
            new_price: '25.00',
          },
        ];
        const response = await server.post('/products/validate').send({
          products,
        });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              error: `O reajuste de preços ultrapassa o limite de 10%. Certifique-se de que o novo preço esteja dentro de 10% do preço atual.`,
            }),
          ]),
        );
      });

      it('ERROR when user tries to update a product that belongs to a package without providing the package readjustment', async () => {
        const packageInDb = {
          code: '1010',
          cost_price: '8.80',
          sales_price: 10.00
        };

        const products = [
          {
            code: '26',
            new_price: '6',
          },
        ];
        const response = await server.post('/products/validate').send({
          products,
        });

        const priceThatPackMustHave = +packageInDb.sales_price - +products[0].new_price

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              error: `ERROR: Para atualizar este produto é necessário ter também no arquivo o pacote com o seu reajuste. Este é o código do pacote que você deve atualizar: ${packageInDb.code}, novo preço inserido: ${products[0].new_price}, preço que o pacote deve ter: ${packageInDb.sales_price.toFixed(
                2,
              )}`,
            }),
          ]),
        );
      });
    });
  });
});
