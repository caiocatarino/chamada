"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const jsonRes = require("../../utils/jsonRes");
const Usuario = require("../../models/usuario");
const CarteiraAcesso = require("../../models/carteiraAcesso");
const router = express.Router();
router.get("/listar", wrap(async (req, res) => {
    res.json(await CarteiraAcesso.listar());
}));
router.get("/obter", wrap(async (req, res) => {
    let id_carteiraAcesso = parseInt(req.query["id_carteiraAcesso"]);
    res.json(isNaN(id_carteiraAcesso) ? null : await CarteiraAcesso.obter(id_carteiraAcesso));
}));
router.post("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let c = req.body;
    jsonRes(res, 400, c ? await CarteiraAcesso.criar(c) : "Dados inválidos!");
}));
router.post("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let c = req.body;
    if (c)
        c.id_carteiraAcesso = parseInt(req.body.id_carteiraAcesso);
    jsonRes(res, 400, (c && !isNaN(c.id_carteiraAcesso)) ? await CarteiraAcesso.alterar(c) : "Dados inválidos!");
}));
router.get("/excluir", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id_carteiraAcesso = parseInt(req.query["id_carteiraAcesso"]);
    jsonRes(res, 400, isNaN(id_carteiraAcesso) ? "Dados inválidos!" : await CarteiraAcesso.excluir(id_carteiraAcesso));
}));
module.exports = router;
//# sourceMappingURL=carteiraAcesso.js.map