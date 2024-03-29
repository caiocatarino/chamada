﻿import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Usuario = require("../../models/usuario");
import Curso = require("../../models/curso");

const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	res.json(await Curso.listar());
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let id_curso = parseInt(req.query["id_curso"]);
	res.json(isNaN(id_curso) ? null : await Curso.obter(id_curso));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let c = req.body as Curso;
	jsonRes(res, 400, c ? await Curso.criar(c) : "Dados inválidos!");
}));

router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let c = req.body as Curso;
	if (c)
		c.id_curso = parseInt(req.body.id_curso);
	jsonRes(res, 400, (c && !isNaN(c.id_curso)) ? await Curso.alterar(c) : "Dados inválidos!");
}));

router.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let id_curso = parseInt(req.query["id_curso"]);
	jsonRes(res, 400, isNaN(id_curso) ? "Dados inválidos!" : await Curso.excluir(id_curso));
}));

export = router;
