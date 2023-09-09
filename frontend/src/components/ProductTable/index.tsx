import React from "react";
import { TableProduct } from "../../App";
import { Container, Table } from "./styles";
import { nanoid } from "nanoid";

interface ProductTableProps {
  products: TableProduct[];
  hasErrors: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, hasErrors }) => {
  return (
    <Container>
      {(hasErrors || products.length > 0) && (
        <Table>
          <tbody>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Preço antigo</th>
              <th>Novo preço</th>
              <th className={`${hasErrors ? "error" : "success"}`}>Status</th>
            </tr>
            {products.map((product) => (
              <tr key={nanoid(4)}>
                <td>{product.code}</td>
                <td>{product.name}</td>
                <td>{product.old_price}</td>
                <td>{product.new_price}</td>
                <td className={`${product.error ? "error" : "success"}`}>
                  {product?.error || "OK! Pronto para atualizar!"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProductTable;
