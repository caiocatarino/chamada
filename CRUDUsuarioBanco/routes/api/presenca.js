"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const jsonRes = require("../../utils/jsonRes");
const Usuario = require("../../models/usuario");
const Presenca = require("../../models/presenca");
const router = express.Router();
router.get("/listar", wrap(async (req, res) => {
    res.json(await Presenca.listar());
}));
router.get("/obter", wrap(async (req, res) => {
    let id_presenca = parseInt(req.query["id_presenca"]);
    res.json(isNaN(id_presenca) ? null : await Presenca.obter(id_presenca));
}));
router.post("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let p = req.body;
    jsonRes(res, 400, p ? await Presenca.criar(p) : "Dados inválidos!");
}));
router.post("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let p = req.body;
    if (p)
        p.id_presenca = parseInt(req.body.id_presenca);
    jsonRes(res, 400, (p && !isNaN(p.id_presenca)) ? await Presenca.alterar(p) : "Dados inválidos!");
}));
router.get("/excluir", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id_presenca = parseInt(req.query["id_presenca"]);
    jsonRes(res, 400, isNaN(id_presenca) ? "Dados inválidos!" : await Presenca.excluir(id_presenca));
}));
module.exports = router;
//# sourceMappingURL=presenca.js.map