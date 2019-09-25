"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Usuario = require("../models/usuario");
const Disciplina = require("../models/disciplina");
const Professor = require("../models/professor");
const Curso = require("../models/curso");
const router = express.Router();
router.all("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("disciplina/alterar", { titulo: "Criar Disciplina", item: null, usuario: u,
            professor: await Professor.listar(),
            curso: await Curso.listar()
        });
    }
}));
router.all("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        let id_disciplina = parseInt(req.query["id_disciplina"]);
        let item = null;
        if (isNaN(id_disciplina) || !(item = await Disciplina.obter(id_disciplina)))
            res.render("shared/nao-encontrado", { usuario: u });
        else
            res.render("disciplina/alterar", { titulo: "Editar Disciplina", usuario: u, item: item,
                professor: await Professor.listar(),
                curso: await Curso.listar() });
    }
}));
router.get("/listar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("disciplina/listar", { titulo: "Gerenciar Disciplinas", usuario: u, lista: JSON.stringify(await Disciplina.listar()) });
    }
}));
module.exports = router;
//# sourceMappingURL=disciplina.js.map