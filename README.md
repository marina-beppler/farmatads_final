# Farmatads

Este é o repositório do projeto **Farmatads**, uma aplicação de gerenciamento de medicamentos com funcionalidades de cadastro e login de usuários, além de notificação dos horários de ingestão de medicações.

## Requisitos

Para rodar este projeto em outra máquina, você precisará instalar as seguintes ferramentas:

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (v12 ou superior)
- [Git](https://git-scm.com/)

## Instalação

### 1. Clonar o Repositório

Clone o repositório na sua máquina local:

```bash
git clone https://github.com/marina-beppler/farmatads.git
cd farmatads
```
### 2. Configurar o Banco de Dados
#### 1 - CRIAR DATABASE

```
CREATE database farmatads;
```

**CERTIFIQUE-SE QUE ESTÁ CONECTADA NESSA DATABASE ANTES DE RODAR QUALQUER OUTRO COMANDO**

#### 2 - CRIAR SCHEMA

```
CREATE schema farmatads;
```

#### 3 - CRIAR BANCO

```
CREATE TABLE farmatads.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE farmatads.tipoMed (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE farmatads.medicamento (
    id SERIAL PRIMARY KEY,
    usuario INTEGER REFERENCES farmatads.users(id),
    tipo INTEGER REFERENCES farmatads.tipoMed(id),
    nome VARCHAR(100) NOT NULL,
    horaInicial TIME NOT NULL,
    intervaloTempo INTEGER NOT NULL,
    cor VARCHAR(30)
);

CREATE TABLE farmatads.capsula (
    qtdCapsula INTEGER NOT NULL
) INHERITS (farmatads.medicamento);

CREATE TABLE farmatads.comprimido (
    qtdComprimido INTEGER NOT NULL
) INHERITS (farmatads.medicamento);

CREATE TABLE farmatads.xarope (
    dosagem INTEGER NOT NULL,
    qtdDose INTEGER NOT NULL
) INHERITS (farmatads.medicamento);
```

#### 4 - INSERIR TIPOS NA TABELA APROPRIADA

```
insert into farmatads.tipoMed(name) values ('xarope');
insert into farmatads.tipoMed(name) values ('capsula');
insert into farmatads.tipoMed(name) values ('comprimido');
```
### 3. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto, no diretório **backend** e configure as seguintes variáveis de ambiente:

```env
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=farmatads
JWT_SECRET=sua_chave_secreta
EMAIL_USER='seuemail@gmail.com'
EMAIL_PASS='sua_senha'
```
### 4. Instalar Dependências

Instale as dependências do projeto com o npm:

```bash
npm install
```
### 5. Rodar a Aplicação

#### Android Studio

O projeto foi feito para ser funcionar em um dispositivo mobile, de modo que roda especificamente por meio do emulador do **Android Studio**. Para rodar o app (build and run), siga o tutorial a seguir: [Tutorial Build and Run (Oficial Android Studio)](https://developer.android.com/studio/run). Caso precise configurar o emulador, siga o seguinte tutorial: [Tutorial Emulador (Oficial Android Studio)](https://developer.android.com/studio/run/emulator?hl=pt-br).

#### Backend em node.js

O *backend* do aplicativo roda separadamente e deve ser ativado antes da aplicação no Android Studio, caso contrário ela não irá funcionar corretamente. Para fazer isso, no diretório *backend*:

```bash
node index.js
```

##### Alteração para localhost

Caso queira testar a aplicação em um navegador, altere todas as chamadas ao *backend*, mudando a parte inicial da URL de **http://10.0.2.2:3000** (necessário para acessar o *localhost* enquanto utilizando o emulador do Android Studio) para **http://localhost:5173**. Dessa forma é possível rodar o projeto por meio do arquivo start.sh, que irá iniciar tanto o front quanto o back ao mesmo tempo. Você pode fazer isso por meio do terminal com:

```
./start.sh
```

## Tecnologias Utilizadas
* Frontend: Vue.js, Ionic Vue;
* Backend: Node.js, Express;
* Banco de Dados: PostgreSQL;
* Autenticação: JWT (JSON Web Token).

