﻿//****************************************************************
// Logo ao abrir o projeto podem aparecer alguns erros nesse
// código, bem como nas dependências do Solution Explorer!
// É normal que isso ocorra, até que o processo de carregamento
// (exibido no canto inferior esquerdo) tenha avançado!
//****************************************************************

//****************************************************************
// @@@
// Para utilizar o view engine ejs, adicionamos a linha
// "ejs": "^2.6.1", às dependências do arquivo package.json
// Isso significa que queremos a versão 2.6.1 do ejs, ou uma
// superior, mas compatível!
// https://docs.npmjs.com/files/package.json
//
// Depois de alterado o arquivo, é preciso clicar com o botão
// direito sobre a dependência, no Solution Explorer, e clicar
// na opção "Install Missing npm Package(s)"
//****************************************************************

import debug = require("debug");
import express = require("express");
import wrap = require("express-async-error-wrapper");
import cookieParser = require("cookie-parser"); // https://stackoverflow.com/a/16209531/3569421
import path = require("path");

// @@@ Configura o cache, para armazenar as 200 últimas páginas
// já processadas, por ordem de uso
import ejs = require("ejs");
import lru = require("lru-cache");
import { NextFunction } from "express";
ejs.cache = lru(200);

const app = express();

// Não queremos o header X-Powered-By
app.disable("x-powered-by");

app.use(cookieParser());

//import Usuario = require("./models/usuario");
// Parei de usar Usuario.pegarDoCookie como middleware, porque existem muitas requests
// que não precisam validar o usuário logado...
//app.use(Usuario.pegarDoCookie); // Coloca o parser de usuário depois do cookie, pois ele usa os cookies

// Explica para o express qual será o diretório de onde serviremos os
// arquivos estáticos (js, css, imagens etc...)
app.use(express.static(path.join(__dirname, "public"), {
	cacheControl: true,
	etag: false,
	maxAge: "30d"
}));
app.use(express.json()); // http://expressjs.com/en/api.html#express.json
app.use(express.urlencoded({ extended: true })); // http://expressjs.com/en/api.html#express.urlencoded

// Configura o diretório de onde tirar as views
app.set("views", path.join(__dirname, "views"));
// @@@ Define o view engine como o ejs e importa o express-ejs-layouts
// https://www.npmjs.com/package/express-ejs-layouts, pois o ejs não
// suporta layouts nativamente: https://www.npmjs.com/package/ejs#layouts
app.set("view engine", "ejs");
app.use(require("express-ejs-layouts"));

// Nosso middleware para evitar cache das páginas e api
// (deixa depois do static, pois os arquivos static devem usar cache e coisas)
app.use((req: express.Request, res: express.Response, next: NextFunction) => {
	res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
	res.header("Expires", "-1");
	res.header("Pragma", "no-cache");
	next();
});

// Especifica quais módulos serão responsáveis por servir cada rota,
// a partir dos endereços requisitados pelo cliente
//
// A string no primeiro parâmetro representa o começo do caminho
// requisitado. Vamos ver alguns exemplos de caminhos, e como eles
// seriam tratados pelo Express
//
// Caminho completo   Caminho do tratador   Tratador e resultado
// /                  /                     index (OK)
// /usuario           /                     usuario (OK)
// /usuario/novo      /novo                 usuario (OK)
// /usuario/alterar   /alterar              usuario (Erro, não temos /alterar em usuario)
// /outra             /outra                index (OK)
// /usuarioteste      /usuarioteste         index (Erro, não temos /usuarioteste em index)
//
// https://expressjs.com/en/guide/routing.html

// Cadastros simples
app.use("/", require("./routes/home"));
app.use("/curso", require("./routes/curso"));
app.use("/usuario", require("./routes/usuario"));
app.use("/professor", require("./routes/professor"));
app.use("/disciplina", require("./routes/disciplina"));
app.use("/aluno", require("./routes/aluno"));
app.use("/carteiraAcesso", require("./routes/carteiraAcesso"));
app.use("/presenca", require("./routes/presenca"));

// API
app.use("/api/curso", require("./routes/api/curso"));
app.use("/api/usuario", require("./routes/api/usuario"));
app.use("/api/disciplina", require("./routes/api/disciplina"));
app.use("/api/professor", require("./routes/api/professor"));
app.use("/api/aluno", require("./routes/api/aluno"));
app.use("/api/carteiraAcesso", require("./routes/api/carteiraAcesso"));
app.use("/api/presenca", require("./routes/api/presenca"));


// Depois de registrados todos os caminhos das rotas e seus
// tratadores, registramos os tratadores que serão chamados
// caso nenhum dos tratadores anteriores tenha devolvido alguma
// resposta
//
// O Express diferencia um tratador regular (como esse aqui) de um tratador
// de erros, como os dois abaixo, pela quantidade de parâmetros!!!
//
// Isso é possível, porque em JavaScript, f.length retorna a quantidade
// de parâmetros declarados na função f!!!
app.use((req: express.Request, res: express.Response, next) => {
	let err = new Error("Não encontrado");
	err["status"] = 404;

	// Executa o próximo tratador na sequência (que no nosso caso
	// será um dos dois tratadores abaixo)
	next(err);
});

// Registra os tratadores de erro
app.use((err: any, req: express.Request, res: express.Response, next) => {
	res.status(err.status || 500);
	res.render("shared/erro", {
		layout: "layout-externo",
		mensagem: err.message,
		// Como é um ambiente de desenvolvimento, deixa o objeto do erro
		// ir para a página, que possivelmente exibirá suas informações
		erro: err
	});

	// Não estamos chamando next(err) aqui porque não temos mais
	// tratadores abaixo desse
});

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
	debug("Express server listening on port " + server.address().port);
});
