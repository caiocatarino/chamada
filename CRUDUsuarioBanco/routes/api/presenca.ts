import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Usuario = require("../../models/usuario");
import Presenca = require("../../models/presenca");

const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	res.json(await Presenca.listar());
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let id_presenca = parseInt(req.query["id_presenca"]);
	res.json(isNaN(id_presenca) ? null : await Presenca.obter(id_presenca));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let p = req.body as Presenca;
	jsonRes(res, 400, p ? await Presenca.criar(p) : "Dados inválidos!");
}));

router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let p = req.body as Presenca;
	if (p)
		p.id_presenca = parseInt(req.body.id_presenca);
	jsonRes(res, 400, (p && !isNaN(p.id_presenca)) ? await Presenca.alterar(p) : "Dados inválidos!");
}));

router.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let id_presenca = parseInt(req.query["id_presenca"]);
	jsonRes(res, 400, isNaN(id_presenca) ? "Dados inválidos!" : await Presenca.excluir(id_presenca));
}));

export = router;
