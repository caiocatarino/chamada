"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const jsonRes = require("../../utils/jsonRes");
const Usuario = require("../../models/usuario");
const router = express.Router();
// Se utilizar router.xxx() mas não utilizar o wrap(), as exceções ocorridas
// dentro da função async não serão tratadas!!!
router.post("/login", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    jsonRes(res, 403, u ? null : await Usuario.efetuarLogin(req.body.login, req.body.senha, res)[0]);
}));
router.get("/logout", wrap(async (req, res) => {
    let u = await Usuario.cookie(req);
    if (u)
        await u.efetuarLogout(res);
    res.sendStatus(204);
}));
router.post("/alterarPerfil", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res);
    if (!u)
        return;
    jsonRes(res, 400, await u.alterarPerfil(res, req.body.nome, req.body.senhaAtual, req.body.novaSenha));
}));
router.get("/listar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    res.json(await Usuario.listar());
}));
router.get("/obter", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id = parseInt(req.query["id"]);
    res.json(isNaN(id) ? null : await Usuario.obter(id));
}));
router.post("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    u = req.body;
    if (u)
        u.tipo = parseInt(req.body.tipo);
    jsonRes(res, 400, u ? await Usuario.criar(u) : "Dados inválidos");
}));
router.post("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id = u.id;
    u = req.body;
    if (u) {
        u.id = parseInt(req.body.id);
        u.tipo = parseInt(req.body.tipo);
    }
    jsonRes(res, 400, (u && !isNaN(u.id)) ? (id === u.id ? "Um usuário não pode alterar a si próprio" : await Usuario.alterar(u)) : "Dados inválidos");
}));
router.get("/excluir", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id = parseInt(req.query["id"]);
    jsonRes(res, 400, isNaN(id) ? "Dados inválidos" : (id === u.id ? "Um usuário não pode excluir a si próprio" : await Usuario.excluir(id)));
}));
router.get("/redefinirSenha", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id = parseInt(req.query["id"]);
    jsonRes(res, 400, isNaN(id) ? "Dados inválidos" : (id === u.id ? "Um usuário não pode redefinir sua própria senha" : await Usuario.redefinirSenha(id)));
}));
module.exports = router;
//# sourceMappingURL=usuario.js.map