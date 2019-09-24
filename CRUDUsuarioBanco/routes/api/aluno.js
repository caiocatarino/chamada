"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const jsonRes = require("../../utils/jsonRes");
const Usuario = require("../../models/usuario");
const Aluno = require("../../models/aluno");
const router = express.Router();
router.get("/listar", wrap(async (req, res) => {
    res.json(await Aluno.listar());
}));
router.get("/obter", wrap(async (req, res) => {
    let id_aluno = parseInt(req.query["id_aluno"]);
    res.json(isNaN(id_aluno) ? null : await Aluno.obter(id_aluno));
}));
router.post("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let c = req.body;
    jsonRes(res, 400, c ? await Aluno.criar(c) : "Dados inválidos!");
}));
router.post("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let a = req.body;
    if (a)
        a.id_aluno = parseInt(req.body.id_aluno);
    jsonRes(res, 400, (a && !isNaN(a.id_aluno)) ? await Aluno.alterar(a) : "Dados inválidos!");
}));
router.get("/excluir", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id_aluno = parseInt(req.query["id_aluno"]);
    jsonRes(res, 400, isNaN(id_aluno) ? "Dados inválidos!" : await Aluno.excluir(id_aluno));
}));
module.exports = router;
//# sourceMappingURL=aluno.js.map