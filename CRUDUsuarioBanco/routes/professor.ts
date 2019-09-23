import express = require("express");
import wrap = require("express-async-error-wrapper");
import Usuario = require("../models/usuario");
import Professor = require("../models/professor");

const router = express.Router();

router.all("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u || !u.admin) {
		res.redirect("/acesso");
	} else {
		res.render("professor/alterar", { titulo: "Criar Professor", usuario: u, item: null });
	}
}));

router.all("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u || !u.admin) {
		res.redirect("/acesso");
	} else {
		let id_professor = parseInt(req.query["id_professor"]);
		let item: Professor = null;
		if (isNaN(id_professor) || !(item = await Professor.obter(id_professor)))
			res.render("shared/nao-encontrado", { usuario: u });
		else
			res.render("professor/alterar", { titulo: "Editar Professor", usuario: u, item: item });
	}
}));

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u || !u.admin) {
		res.redirect("/acesso");
	} else {
		res.render("professor/listar", { titulo: "Gerenciar Professores", usuario: u, lista: JSON.stringify(await Professor.listar()) });
	}
}));

export = router;
