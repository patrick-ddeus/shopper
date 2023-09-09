import React, { ReactNode } from "react";

import { Container } from "./styles";

type ButtonProps = {
  children: ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {
  return (
    <Container onClick={onClick} disabled={disabled}>
      {children}
    </Container>
  );
};

export default Button;
