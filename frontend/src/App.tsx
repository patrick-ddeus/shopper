import useDrag from "./hooks/useDrag";
import { useEffect, useState, useReducer } from "react";
import DragAndDrop from "./components/DragAndDrop";
import { sendAndValidate, putProduct } from "./services/products";
import ProductTable from "./components/ProductTable";
import { toast } from "react-toastify";
import Toast from "./components/Toast";

enum ACTION_TYPE {
  ADD_PRODUCT_TO_TABLE = "ADD_PRODUCT_TO_TABLE",
  RESET_PRODUCTS = "RESET_PRODUCTS",
}

export type TableProduct = {
  name: string;
  code: string;
  old_price: number | string;
  new_price: number | string;
  error: string;
};

export type ValidProductToUpdate = Pick<TableProduct, "code" | "new_price">;

export type ProductsState = {
  products: TableProduct[];
};

type ProductAction = {
  type: ACTION_TYPE;
  payload?: TableProduct[];
};

let validProducts: ValidProductToUpdate[] = [];

const productsReducer = (state: ProductsState, action: ProductAction) => {
  switch (action.type) {
    case ACTION_TYPE.ADD_PRODUCT_TO_TABLE:
      return {
        ...state,
        products: action.payload as TableProduct[],
      };
    case ACTION_TYPE.RESET_PRODUCTS:
      return {
        products: [],
      };
    default: {
      return state;
    }
  }
};

function App() {
  const { isDragging, ref, onDrop } = useDrag<HTMLElement>();
  const [eventFiles, setEventFiles] = useState<FileList>();
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [state, dispatch] = useReducer(productsReducer, {
    products: [],
  });

  const handleFiles = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch({
      type: ACTION_TYPE.RESET_PRODUCTS,
    });

    if (!eventFiles) return alert("Entre com um arquivo.csv");

    for (const file of eventFiles) {
      if (file.type !== "text/csv") {
        alert("Arquivo Inválido!");
        setEventFiles(undefined);
        break;
      }
      readFilesAndValidate(file);
    }
  };

  const readFilesAndValidate = (file: File) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const result = event.target?.result;
      const productList = (result as string).split("\r\n");

      await validateProducts(productList);
    };

    reader.readAsText(file);
  };

  const validateProducts = async (productList: string[]) => {
    const invalidProducts: TableProduct[] = [];
    validProducts = [];

    for (let i = 1; i < productList.length; i++) {
      const line = productList[i];

      const parts = line.split(",");
      const [code, price] = parts;

      if (!code || !price) {
        invalidProducts.push({
          code: code || "missing!",
          name: "couldn't find",
          old_price: "couldn't find",
          new_price: price ? "missing!" : "invalid",
          error: `${
            code ? "new_price" : "code"
          } is missing! you must provide all columns, check line: ${i + 1}`,
        });
        continue;
      }

      const priceInNumber = parseFloat(price);

      if (isNaN(priceInNumber)) {
        invalidProducts.push({
          code,
          name: "undefined",
          old_price: "not found",
          new_price: "invalid",
          error: "price must be a valid number!",
        });
        continue;
      }

      validProducts.push({ code, new_price: price });
    }

    if (invalidProducts.length > 0) {
      return dispatch({
        type: ACTION_TYPE.ADD_PRODUCT_TO_TABLE,
        payload: invalidProducts,
      });
    }

    await sendProductsAndValidate(validProducts);
  };

  const sendProductsAndValidate = async (
    validProducts: ValidProductToUpdate[]
  ) => {
    const body: Record<string, ValidProductToUpdate[]> = {
      products: validProducts,
    };

    const products = await toast.promise(
      sendAndValidate<Record<string, ValidProductToUpdate[]>>(
        `/products/validate`,
        body
      ),
      {
        pending: "Validando Produtos!",
        success: "Validação concluída!",
        error: "Erro durante a validação, verifique sua API. 🤯",
      }
    );
    dispatch({ type: ACTION_TYPE.ADD_PRODUCT_TO_TABLE, payload: products });
    return products;
  };

  const updateProducts = async () => {
    const body: Record<string, ValidProductToUpdate[]> = {
      products: validProducts,
    };

    await toast.promise(
      putProduct<Record<string, ValidProductToUpdate[]>>(`/products`, body),
      {
        pending: "Atualizando produtos!",
        success: "Produto atualizado com sucesso! 🥳",
        error: "Erro durante a atualização, verifique sua API. 🤯",
      }
    );
    dispatch({ type: ACTION_TYPE.RESET_PRODUCTS });
    setHasErrors(false);
  };

  useEffect(() => {
    setEventFiles(onDrop?.dataTransfer?.files);
  }, [onDrop]);

  useEffect(() => {
    const hasErrors = state.products.some((product) => product.error);
    setHasErrors(hasErrors);
  }, [state.products]);

  return (
    <>
      <Toast />
      <DragAndDrop
        handleFiles={handleFiles}
        isDragging={isDragging}
        elementReference={ref}
        hasErrors={hasErrors}
        products={state.products}
        updateProducts={updateProducts}
      />
      <ProductTable products={state.products} hasErrors={hasErrors} />
    </>
  );
}

export default App;
