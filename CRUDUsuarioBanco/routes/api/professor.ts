import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Usuario = require("../../models/usuario");
import Professor = require("../../models/professor");

const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	res.json(await Professor.listar());
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let id_professor = parseInt(req.query["id_professor"]);
	res.json(isNaN(id_professor) ? null : await Professor.obter(id_professor));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
	//let u = await Usuario.cookie(req, res, true);
	//if (!u)
	//	return;
	let p = req.body as Professor;
	jsonRes(res, 400, p ? await Professor.criar(p) : "Dados inválidos!");
}));

router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let p = req.body as Professor;
	if (p)
		p.id_professor = parseInt(req.body.id_professor);
	jsonRes(res, 400, (p && !isNaN(p.id_professor)) ? await Professor.alterar(p) : "Dados inválidos!");
}));

router.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let id_professor = parseInt(req.query["id_professor"]);
	jsonRes(res, 400, isNaN(id_professor) ? "Dados inválidos!" : await Professor.excluir(id_professor));
}));

export = router;
