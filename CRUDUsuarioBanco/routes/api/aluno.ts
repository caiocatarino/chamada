import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Usuario = require("../../models/usuario");
import Aluno = require("../../models/aluno");


const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	res.json(await Aluno.listar());
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let id_aluno = parseInt(req.query["id_aluno"]);
	res.json(isNaN(id_aluno) ? null : await Aluno.obter(id_aluno));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let c = req.body as Aluno;
	jsonRes(res, 400, c ? await Aluno.criar(c) : "Dados inválidos!");
}));

router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let a = req.body as Aluno;
	if (a)
		a.id_aluno = parseInt(req.body.id_aluno);
	jsonRes(res, 400, (a && !isNaN(a.id_aluno)) ? await Aluno.alterar(a) : "Dados inválidos!");
}));

router.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let id_aluno = parseInt(req.query["id_aluno"]);
	jsonRes(res, 400, isNaN(id_aluno) ? "Dados inválidos!" : await Aluno.excluir(id_aluno));
}));

export = router;
