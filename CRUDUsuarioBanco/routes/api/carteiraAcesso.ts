import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Usuario = require("../../models/usuario");
import CarteiraAcesso = require("../../models/carteiraAcesso");

const router = express.Router();

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	res.json(await CarteiraAcesso.listar());
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let id_carteiraAcesso = parseInt(req.query["id_carteiraAcesso"]);
	res.json(isNaN(id_carteiraAcesso) ? null : await CarteiraAcesso.obter(id_carteiraAcesso));
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let c = req.body as CarteiraAcesso;
	jsonRes(res, 400, c ? await CarteiraAcesso.criar(c) : "Dados inválidos!");
}));

router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let c = req.body as CarteiraAcesso;
	if (c)
		c.id_carteiraAcesso = parseInt(req.body.id_carteiraAcesso);
	jsonRes(res, 400, (c && !isNaN(c.id_carteiraAcesso)) ? await CarteiraAcesso.alterar(c) : "Dados inválidos!");
}));

router.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;
	let id_carteiraAcesso = parseInt(req.query["id_carteiraAcesso"]);
	jsonRes(res, 400, isNaN(id_carteiraAcesso) ? "Dados inválidos!" : await CarteiraAcesso.excluir(id_carteiraAcesso));
}));

export = router;
