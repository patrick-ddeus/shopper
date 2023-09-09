# Ferramenta de Atualização de Preços para E-commerce

## Visão Geral do Projeto

Esta ferramenta permite que os usuários atualizem os preços dos produtos de sua loja de e-commerce de forma massiva e segura, evitando erros que possam prejudicar o negócio. Ela foi desenvolvida em Node.js (back end) e React.js (front-end) e utiliza um banco de dados MySQL para armazenar informações.

## Requisitos do Sistema

- Node.js e npm
- Banco de dados MySQL (versão 8)

## Instruções

Siga as instruções abaixo para configurar o ambiente de desenvolvimento:

1. **Node.js e npm:**

   - Instale o Node.js e o npm em seu sistema. Você pode encontrar as instruções em [nodejs.org](https://nodejs.org/).

2. **Banco de Dados MySQL:**

   - Configure o banco de dados MySQL e defina as credenciais de acesso.
   - Crie um arquivo `.env` para armazenar as informações sensíveis do banco de dados.

3. **Clone o Repositório:**

   - Clone este repositório para o seu ambiente local.

4. **Instalação de Dependências:**
   - Dentro das pastas `backend` e `frontend`, execute o comando `npm install` para instalar as dependências.

## Node.js e npm:

Antes de tudo é necessário que você tenha o `node 18 LTS` instalado em sua máquina. Ele é necessário para que o projeto possa ser executado.

## Instalação com Docker (Recomendado)

Se você preferir usar o Docker para configurar o ambiente de desenvolvimento, siga as instruções abaixo:

### Requisitos do Sistema

- Docker: Certifique-se de ter o Docker instalado em seu sistema. Você pode encontrar instruções de instalação em [docker.com](https://www.docker.com/get-started).

### Instruções de Uso

1. **Clone o Repositório:**

   - Clone este repositório para o seu ambiente local:

   ```shell
   git clone https://github.com/patrick-ddeus/shopper.git
   ```

### Configuração do banco de dados

Configure o banco de dados MySQL por meio do Docker. Use o arquivo `docker-compose.yml` fornecido. Para configurar as credenciais do banco use o `.env` já fornecido pelo repositório. Algumas informações sobre as credenciais:

```
MYSQL_ROOT_PASSWORD=SENHA DO USUÁRIO ROOT
MYSQL_USER=SEU USUÁRIO
MYSQL_PASSWORD=SENHA DO SEU USUÁRIO
MYSQL_DATABASE=shopper (NOME DA TABELA NO BANCO)
```

Após a configuração das credenciais utilize o comando do docker

### Back End e Front End:

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

### Acesso ao Banco de Dados via phpMyAdmin (Opcional):

Você pode acessar o phpMyAdmin para gerenciar o banco de dados MySQL através do seguinte link: http://localhost:8088.
Use as credenciais definidas no arquivo docker-compose.yml para fazer login.

```shell
docker-compose up -d
```

Isso iniciará um contêiner MySQL com as configurações definidas no arquivo docker-compose.yml.

## Comandos Úteis do Docker

- `docker-compose up -d`: Iniciar os contêineres do Docker em segundo plano.
- `docker-compose down`: Encerrar os contêineres e remover os volumes.
- `docker ps`: Listar todos os contêineres em execução.
- `docker-compose logs`: Visualizar logs dos contêineres.

Lembre-se de que o ambiente Docker já inclui as configurações necessárias para o MySQL, tornando a configuração mais fácil e eficiente.

## Instalação normal

### Configuração do Banco de Dados

Certifique-se de criar o banco de dados corretamente e configurar com as credenciais definidas no arquivo `.env` dentro da pasta `backend`, um `.env.example` foi fornecido como exemplo. Nesse repositório existe um arquivo `database.sql` que você pode utilizar como dump para o banco de dados.

### Execução do Projeto

Siga as etapas abaixo para iniciar o back end e o front-end:

**Back End e Front End:**

Entre nas pastas backend e frontend do projeto e siga as instruções anteriores para iniciar o back end e o front-end.

### Uso

1. Faça o upload do arquivo CSV contendo os códigos de produtos e os novos preços.
2. Clique no botão "VALIDAR" para verificar a formatação do arquivo e as regras de validação.
3. O sistema exibirá informações dos produtos, incluindo código, nome, preço atual e novo preço após a validação.
4. Caso uma ou mais regras de validação sejam quebradas, o sistema exibirá feedback ao lado de cada produto no campo status.
5. O botão "ATUALIZAR" só estará habilitado se todos os produtos estiverem validados e sem regras quebradas.
6. Clique em "ATUALIZAR" para aplicar os novos preços no banco de dados.
