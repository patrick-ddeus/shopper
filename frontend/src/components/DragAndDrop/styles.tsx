import styled from "styled-components";

type DropContainerProps = {
  $isDragging: boolean;
  ref: React.RefObject<HTMLElement>;
};

export const Container = styled.div`
  margin-top: 100px;
  display: flex;
  place-items: center center;
  flex-direction: column;
  gap: 10px;
`;

export const DropContainer = styled.div<DropContainerProps>`
  width: 300px;
  height: 200px;
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  border: 2px #c3c3c3 dashed;
  border-radius: 12px;
  transition: border 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    text-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1);

  border-color: ${({ $isDragging }) => $isDragging && "var(--primary-color)"};

  ${({ $isDragging }) =>
    $isDragging &&
    `
    text-shadow: 10px 10px 25px var(--primary-color),
    -10px 10px 25px var(--primary-color),
    -10px -10px 25px var(--primary-color),
    10px -10px 25px var(--primary-color);
  `}
`;
