"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Usuario = require("../models/usuario");
const Aluno = require("../models/aluno");
const Curso = require("../models/curso");
const router = express.Router();
router.all("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("aluno/alterar", { titulo: "Criar Aluno", item: null, usuario: u, curso: await Curso.listar() });
    }
}));
router.all("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        let id_aluno = parseInt(req.query["id_aluno"]);
        let item = null;
        if (isNaN(id_aluno) || !(item = await Aluno.obter(id_aluno)))
            res.render("shared/nao-encontrado", { usuario: u });
        else
            res.render("aluno/alterar", { titulo: "Editar Aluno", usuario: u, item: item, curso: await Curso.listar() });
    }
}));
router.get("/listar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("aluno/listar", { titulo: "Gerenciar Alunos", usuario: u, lista: JSON.stringify(await Aluno.listar()) });
    }
}));
module.exports = router;
//# sourceMappingURL=aluno.js.map