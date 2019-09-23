"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const Usuario = require("../models/usuario");
const router = express.Router();
router.all("/", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u) {
        let mensagem = null;
        if (req.body.login || req.body.senha) {
            [mensagem, u] = await Usuario.efetuarLogin(req.body.login, req.body.senha, res);
            if (mensagem)
                res.render("home/login", { layout: "layout-externo", mensagem: mensagem });
            else
                res.render("home/index", { usuario: u });
        }
        else {
            res.render("home/login", { layout: "layout-externo", mensagem: null });
        }
    }
    else {
        res.render("home/index", { usuario: u });
    }
}));
router.get("/acesso", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u) {
        res.redirect("/");
    }
    else {
        res.render("home/acesso", { titulo: "Sem Permissão", usuario: u });
    }
}));
router.get("/perfil", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (!u) {
        res.redirect("/");
    }
    else {
        res.render("home/perfil", { titulo: "Meu Perfil", usuario: u });
    }
}));
router.get("/logout", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (u)
        await u.efetuarLogout(res);
    res.redirect("/");
}));
module.exports = router;
//# sourceMappingURL=home.js.map