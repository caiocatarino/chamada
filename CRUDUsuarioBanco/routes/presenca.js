"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Usuario = require("../models/usuario");
const Presenca = require("../models/presenca");
const Aluno = require("../models/aluno");
const Disciplina = require("../models/disciplina");
const router = express.Router();
router.all("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("presenca/alterar", { titulo: "Criar Presença", item: null, usuario: u, aluno: await Aluno.listar(), disciplina: await Disciplina.listar() });
    }
}));
router.all("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        let id_presenca = parseInt(req.query["id_presenca"]);
        let item = null;
        if (isNaN(id_presenca) || !(item = await Presenca.obter(id_presenca)))
            res.render("shared/nao-encontrado", { usuario: u });
        else
            res.render("presenca/alterar", { titulo: "Editar Presença", usuario: u, item: item, aluno: await Aluno.listar(), disciplina: await Disciplina.listar() });
    }
}));
router.get("/listar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("presenca/listar", { titulo: "Gerenciar Presenças", usuario: u, lista: JSON.stringify(await Presenca.listar()) });
    }
}));
module.exports = router;
//# sourceMappingURL=presenca.js.map