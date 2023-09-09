import React, { useState, useEffect } from "react";
import { Container, DropContainer } from "./styles";
import { TableProduct } from "../../App";
import Button from "../Button";

type DragAndDropProps = {
  isDragging: boolean;
  elementReference: React.RefObject<HTMLElement>;
  hasErrors: boolean;
  products: TableProduct[];
  handleFiles: (e: React.MouseEvent<HTMLButtonElement>) => void;
  updateProducts: () => void;
};

const DragAndDrop: React.FC<DragAndDropProps> = ({
  isDragging,
  elementReference,
  handleFiles,
  hasErrors,
  products,
  updateProducts,
}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (products.length === 0 || hasErrors) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [products, hasErrors]);

  return (
    <Container>
      <DropContainer $isDragging={isDragging} ref={elementReference}>
        Arraste seu arquivo .csv
      </DropContainer>
      <Button onClick={handleFiles}>Validar</Button>
      <Button onClick={updateProducts} disabled={isDisabled}>
        Atualizar
      </Button>
    </Container>
  );
};

export default DragAndDrop;
