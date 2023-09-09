import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 40px;
  font-family: "Roboto", sans-serif;
  border-color: #ddd;

  & th {
    color: #292929;
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.045rem;
    flex: 1;
    padding: 0.875rem 1.375rem;
  }

  & tr {
    display: flex;
    gap: 0.625rem;
    border-bottom: 1px solid #ddd;
  }

  & tr td {
    font-size: 0.875rem;
    padding: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: #292929;
    text-align: center;
    flex: 1;
    display: flex;
    place-items: center;
    place-content: center;
  }

  & tr td.error {
    color: red;
  }

  & tr td.success {
    color: green;
  }

  & tr:nth-child(odd) {
    background-color: #f6f6f6;
  }

  & tr:nth-child(even) {
    background-color: #fff;
  }
`;
export const Container = styled.div`
  width: 80vw;
  margin: 0 auto;
`;
