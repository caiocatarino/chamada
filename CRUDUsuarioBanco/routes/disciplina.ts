import express = require("express");
import wrap = require("express-async-error-wrapper");
import Usuario = require("../models/usuario");
import Disciplina = require("../models/disciplina");

const router = express.Router();

router.all("/criar", wrap(async (req: express.Request, res: express.Response) => {
	//let u = await Usuario.cookie(req);
	//if (!u || !u.admin) {
	//	res.redirect("/acesso");
	//} else {
		res.render("disciplina/alterar", { titulo: "Criar Disciplina", item: null });
	//}
}));

router.all("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u || !u.admin) {
		res.redirect("/acesso");
	} else {
		let id_disciplina = parseInt(req.query["id_disciplina"]);
		let item: Disciplina = null;
		if (isNaN(id_disciplina) || !(item = await Disciplina.obter(id_disciplina)))
			res.render("shared/nao-encontrado", { usuario: u });
		else
			res.render("disciplina/alterar", { titulo: "Editar Disciplina", usuario: u, item: item });
	}
}));

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u || !u.admin) {
		res.redirect("/acesso");
	} else {
		res.render("disciplina/listar", { titulo: "Gerenciar Disciplinas", usuario: u, lista: JSON.stringify(await Disciplina.listar()) });
	}
}));

export = router;
