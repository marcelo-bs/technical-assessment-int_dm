# Guia de Instalação e Execução

Este é um guia rápido para instalar e executar o projeto.

## Instalação

### Repositório Git

Clone este repositório para a sua máquina local usando o seguinte comando:

```
git clone https://github.com/marcelo-bs/technical-assessment-int_dm.git
```

Depois de clonar, acesse a branch que foi desenvolvida:

```
git checkout marcelo-silveira
```


### Dependências NPM

Para instalar as dependências do projeto, execute o seguinte comando:

```
npm install
```


### .env

**Crie um arquivo .env contendo as mesmas variáveis que estão presentes no arquivo .env.example e cole no arquivo criado**



### Docker

Este projeto pode ser executado utilizando Docker. Certifique-se de ter o Docker e o Docker Compose instalados.

Para iniciar o projeto com Docker, execute o seguinte comando:

```
docker-compose up -d
```


## Execução em Ambiente de Desenvolvimento

Para iniciar o projeto em modo de desenvolvimento, execute o seguinte comando:

```
npm run dev
```
Isso iniciará o servidor de desenvolvimento.

## Documentação Swagger

Abra http://localhost:3003/api-docs/ em seu navegador para acessar a documentação da API.
