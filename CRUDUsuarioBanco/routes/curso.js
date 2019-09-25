"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Usuario = require("../models/usuario");
const Curso = require("../models/curso");
const router = express.Router();
router.all("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("curso/alterar", { titulo: "Criar Curso", item: null, usuario: u });
    }
}));
router.all("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        let id_curso = parseInt(req.query["id_curso"]);
        let item = null;
        if (isNaN(id_curso) || !(item = await Curso.obter(id_curso)))
            res.render("shared/nao-encontrado", { usuario: u });
        else
            res.render("curso/alterar", { titulo: "Editar Curso", usuario: u, item: item });
    }
}));
router.get("/listar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("curso/listar", { titulo: "Gerenciar Cursos", usuario: u, lista: JSON.stringify(await Curso.listar()) });
    }
}));
module.exports = router;
//# sourceMappingURL=curso.js.map