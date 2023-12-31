# Ferramenta de Atualização de Preços para E-commerce

## Visão Geral do Projeto

Esta ferramenta permite que os usuários atualizem os preços dos produtos de sua loja de e-commerce de forma massiva e segura, evitando erros que possam prejudicar o negócio. Ela foi desenvolvida em Node.js (back end) e React.js (front-end) e utiliza um banco de dados MySQL para armazenar informações.

## Índice 

* [Requisitos do Sistema](##Requisitos-do-Sistema)
* [Nota](##Nota)
* [Instalação com Docker (Recomendado)](##Instalação-com-Docker-(Recomendado))
* [Instalação normal](##Instalação-normal)
* [Uso](##Uso)
* [Testes](##Testes)


## Requisitos do Sistema

- Node.js e npm
- Banco de dados MySQL (versão 8)

## Node.js e npm:

Antes de tudo é necessário que você tenha o `node 18 LTS` instalado em sua máquina. Ele é necessário para que o projeto possa ser executado.

## Nota 
O arquivo `.env` criado na raíz desse repositório é usado para a configuração do Docker, se for usar uma configuração manual então utilize os `.env` que estão dentro das pastas `frontend` e `backend`, o guia para configurar esses dois arquivos estão nas instruções manuais.
Existem 2 formas de instalar esse projeto, com Docker e Manualmente, segue a instalação com Docker primeiramente:

## Instalação com Docker (Recomendado) 

Se você preferir usar o Docker para configurar o ambiente de desenvolvimento, siga as instruções abaixo:

### Requisitos do Sistema

- Docker: Certifique-se de ter o Docker instalado em seu sistema. Você pode encontrar instruções de instalação em [docker.com](https://www.docker.com/get-started).

### Clone o Repositório


   ```shell
   git clone https://github.com/patrick-ddeus/shopper.git
   ```

### Configuração do banco de dados

Configure o banco de dados MySQL por meio do Docker. Para isso basta configurar as credenciais do banco no `.env` fornecido na raíz desse repositório. Algumas informações sobre as credenciais:

```
MYSQL_ROOT_PASSWORD=SENHA DO USUÁRIO ROOT
MYSQL_USER=SEU USUÁRIO
MYSQL_PASSWORD=SENHA DO SEU USUÁRIO
MYSQL_DATABASE=shopper (NOME DA TABELA NO BANCO)
```

### Back End e Front End:

Na pasta `backend` e na pasta `frontend`, crie um arquivo `.env` e preenche-o com as credenciais corretas para que o sistema funcione dentro do Docker:


### Construção dos Containers
Certifique-se de estar na pasta raíz desse repositório onde fica o `docker-compose.yml`

```shell
docker-compose up -d
```

Isso iniciará todos os containers necessários para a execução da aplicação, o arquivo `.env` na raíz do repositório garantirá que o MySQL seja iniciado com as configurações definidas no arquivo docker-compose.yml.

Para as configurações setadas caso todos os conteinêrs tenham sido iniciados corretamente sua aplicação estará disponível em http://localhost:3030. 

### Acesso ao Banco de Dados via phpMyAdmin (Opcional):

Você pode acessar o phpMyAdmin para gerenciar o banco de dados MySQL através do seguinte link: http://localhost:8088.
Use as credenciais definidas no arquivo docker-compose.yml para fazer login.
No painel você poderá carregar as queries do arquivo `database.sql` para que a aplicação funcione corretamente.

### Comandos Úteis do Docker

- `docker-compose up -d`: Iniciar os containers do Docker em segundo plano.
- `docker-compose down`: Encerrar os containers e remover os volumes.
- `docker ps`: Listar todos os containers em execução.
- `docker-compose logs`: Visualizar logs dos containers.

Lembre-se de que o ambiente Docker já inclui as configurações necessárias para o MySQL, tornando a configuração mais fácil e eficiente.

## Instalação normal

### Configuração do Banco de Dados

Certifique-se de ter o mysql instalado e de ter criado o banco de dados corretamente, após isso configure as credenciais definidas no arquivo `.env` dentro da pasta `backend`, um `.env.example` foi fornecido como exemplo. Nesse repositório existe um arquivo `database.sql` que você pode utilizar como dump para o banco de dados.

### Execução do Projeto

Siga as etapas abaixo para iniciar o back end e o front-end:

**Back End e Front End:**

Na pasta `backend`, crie um arquivo `.env` e preenche-o com as credenciais corretas e então execute o seguinte comando para atualizar as dependências:

```shell
   npm i
```

E para iniciar o projeto:

```shell
   npm run dev
```

**Front End:**

Na pasta `frontend` faça o mesmo. Crie o .env e então:

```shell
   npm i
```

E para iniciar o projeto:

```shell
   npm run dev
```

## Uso

1. Faça o upload do arquivo CSV contendo os códigos de produtos e os novos preços.
2. Clique no botão "VALIDAR" para verificar a formatação do arquivo e as regras de validação.
3. O sistema exibirá informações dos produtos, incluindo código, nome, preço atual e novo preço após a validação.
4. Caso uma ou mais regras de validação sejam quebradas, o sistema exibirá feedback ao lado de cada produto no campo status.
5. O botão "ATUALIZAR" só estará habilitado se todos os produtos estiverem validados e sem regras quebradas.
6. Clique em "ATUALIZAR" para aplicar os novos preços no banco de dados.

## Testes

Foram criados testes de integração no `backend` para testar as regras de negócio e a validação dos erros. Não tive tempo de desenvolver mais testes contudo fiz os principais casos de erro. Foi fornecido um arquivo `database.sql` para testes na pasta `test`, esse arquivo contêm alguns produtos com valores atualizados para que os testes funcionem adequadamente. Sem trapaças.

### Configuração

Para configurar os testes você precisa criar um novo arquivo chamado `.env.test` com as mesmas informações do seu `.env` principal, porém com uma tabela de dados diferente que você mesmo deverá criar.

### Comandos

Para rodar os testes basta usar o comando:

```
npm run test
```
ou
```
npm run test:watch
```
para que os testes continuem rodando.
