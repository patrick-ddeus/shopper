-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09/09/2023 às 04:35
-- Versão do servidor: 8.1.0
-- Versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `shopper`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `packs`
--

CREATE TABLE `packs` (
  `id` bigint NOT NULL,
  `pack_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `qty` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `packs`
--

INSERT INTO `packs` (`id`, `pack_id`, `product_id`, `qty`) VALUES
(1, 1000, 18, 6),
(2, 1010, 24, 1),
(3, 1010, 26, 1),
(4, 1020, 19, 3),
(5, 1020, 21, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `products`
--

CREATE TABLE `products` (
  `code` bigint NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `cost_price` decimal(9,2) NOT NULL,
  `sales_price` decimal(9,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `products`
--

INSERT INTO `products` (`code`, `name`, `cost_price`, `sales_price`) VALUES
(16, 'AZEITE  PORTUGUÊS  EXTRA VIRGEM GALLO 500ML', 18.44, 21.00),
(18, 'BEBIDA ENERGÉTICA VIBE 2L', 8.09, 9.50),
(19, 'ENERGÉTICO  RED BULL ENERGY DRINK 250ML', 6.56, 7.34),
(20, 'ENERGÉTICO RED BULL ENERGY DRINK 355ML', 9.71, 10.79),
(21, 'BEBIDA ENERGÉTICA RED BULL RED EDITION 250ML', 10.71, 11.66),
(22, 'ENERGÉTICO  RED BULL ENERGY DRINK SEM AÇÚCAR 250ML', 6.74, 7.49),
(23, 'ÁGUA MINERAL BONAFONT SEM GÁS 1,5L', 2.15, 2.42),
(24, 'FILME DE PVC WYDA 28CMX15M', 3.59, 4.00),
(26, 'ROLO DE PAPEL ALUMÍNIO WYDA 30CMX7,5M', 5.21, 6.01),
(1000, 'BEBIDA ENERGÉTICA VIBE 2L - 6 UNIDADES', 48.54, 57.00),
(1010, 'KIT ROLO DE ALUMINIO + FILME PVC WYDA', 8.80, 9.00),
(1020, 'SUPER PACK RED BULL VARIADOS - 6 UNIDADES', 51.81, 57.00);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `packs`
--
ALTER TABLE `packs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pack_id` (`pack_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Índices de tabela `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`code`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `packs`
--
ALTER TABLE `packs`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `packs`
--
ALTER TABLE `packs`
  ADD CONSTRAINT `packs_ibfk_1` FOREIGN KEY (`pack_id`) REFERENCES `products` (`code`),
  ADD CONSTRAINT `packs_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
