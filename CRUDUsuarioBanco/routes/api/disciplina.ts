import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Usuario = require("../../models/usuario");
import Disciplina = require("../../models/disciplina");

const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	res.json(await Disciplina.listar());
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let id_disciplina = parseInt(req.query["id_disciplina"]);
	res.json(isNaN(id_disciplina) ? null : await Disciplina.obter(id_disciplina));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let d = req.body as Disciplina;
	jsonRes(res, 400, d ? await Disciplina.criar(d) : "Dados inválidos!");
}));

router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let d = req.body as Disciplina;
	if (d)
		d.id_disciplina = parseInt(req.body.id_disciplina);
	jsonRes(res, 400, (d && !isNaN(d.id_disciplina)) ? await Disciplina.alterar(d) : "Dados inválidos!");
}));

router.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let id_disciplina = parseInt(req.query["id_disciplina"]);
	jsonRes(res, 400, isNaN(id_disciplina) ? "Dados inválidos!" : await Disciplina.excluir(id_disciplina));
}));

export = router;
