"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Usuario = require("../models/usuario");
const CarteiraAcesso = require("../models/carteiraAcesso");
const Aluno = require("../models/aluno");
const router = express.Router();
router.all("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("carteiraAcesso/alterar", { titulo: "Criar Carteira de Acesso", item: null, usuario: u, aluno: await Aluno.listar() });
    }
}));
router.all("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        let id_carteiraAcesso = parseInt(req.query["id_carteiraAcesso"]);
        let item = null;
        if (isNaN(id_carteiraAcesso) || !(item = await CarteiraAcesso.obter(id_carteiraAcesso)))
            res.render("shared/nao-encontrado", { usuario: u });
        else
            res.render("carteiraAcesso/alterar", { titulo: "Editar Carteira de Acesso", usuario: u, item: item, aluno: await Aluno.listar() });
    }
}));
router.get("/listar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("carteiraAcesso/listar", { titulo: "Gerenciar Carteiras de Acesso", usuario: u, lista: JSON.stringify(await CarteiraAcesso.listar()) });
    }
}));
module.exports = router;
//# sourceMappingURL=carteiraAcesso.js.map