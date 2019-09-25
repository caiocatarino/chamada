"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Usuario = require("../models/usuario");
const Professor = require("../models/professor");
const router = express.Router();
router.all("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("professor/alterar", { titulo: "Criar Professor", usuario: u, item: null });
    }
}));
router.all("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        let id_professor = parseInt(req.query["id_professor"]);
        let item = null;
        if (isNaN(id_professor) || !(item = await Professor.obter(id_professor)))
            res.render("shared/nao-encontrado", { usuario: u });
        else
            res.render("professor/alterar", { titulo: "Editar Professor", usuario: u, item: item });
    }
}));
router.get("/listar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("professor/listar", { titulo: "Gerenciar Professores", usuario: u, lista: JSON.stringify(await Professor.listar()) });
    }
}));
module.exports = router;
//# sourceMappingURL=professor.js.map