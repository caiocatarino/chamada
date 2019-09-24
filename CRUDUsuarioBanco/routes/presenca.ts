import express = require("express");
import wrap = require("express-async-error-wrapper");
import Usuario = require("../models/usuario");
import Presenca = require("../models/presenca");
import Aluno = require("../models/aluno");
import Disciplina = require("../models/disciplina");

const router = express.Router();

router.all("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u || !u.admin) {
		res.redirect("/acesso");
	} else {
		res.render("presenca/alterar", { titulo: "Criar Presença", item: null ,usuario: u,aluno: await Aluno.listar(),disciplina: await Disciplina.listar()});
	}
}));

router.all("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u || !u.admin) {
		res.redirect("/acesso");
	} else {
		let id_presenca = parseInt(req.query["id_presenca"]);
		let item: Presenca = null;
		if (isNaN(id_presenca) || !(item = await Presenca.obter(id_presenca)))
			res.render("shared/nao-encontrado", { usuario: u });
		else
			res.render("presenca/alterar", { titulo: "Editar Presença", usuario: u, item: item,aluno: await Aluno.listar(),disciplina: await Disciplina.listar() });
	}
}));

router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u || !u.admin) {
		res.redirect("/acesso");
	} else {
		res.render("presenca/listar", { titulo: "Gerenciar Presenças", usuario: u, lista: JSON.stringify(await Presenca.listar()) });
	}
}));

export = router;
