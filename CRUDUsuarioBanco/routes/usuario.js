"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Usuario = require("../models/usuario");
const router = express.Router();
router.all("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("usuario/alterar", { titulo: "Criar Usuário", usuario: u, item: null });
    }
}));
router.all("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        let id = parseInt(req.query["id"]);
        let item = null;
        if (isNaN(id) || !(item = await Usuario.obter(id)))
            res.render("shared/nao-encontrado", { usuario: u });
        else
            res.render("usuario/alterar", { titulo: "Editar Usuário", usuario: u, item: item });
    }
}));
router.get("/listar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("usuario/listar", { titulo: "Gerenciar Usuários", usuario: u, lista: JSON.stringify(await Usuario.listar()) });
    }
}));
module.exports = router;
//# sourceMappingURL=usuario.js.map