"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const jsonRes = require("../../utils/jsonRes");
const Usuario = require("../../models/usuario");
const Disciplina = require("../../models/disciplina");
const router = express.Router();
router.get("/listar", wrap(async (req, res) => {
    res.json(await Disciplina.listar());
}));
router.get("/obter", wrap(async (req, res) => {
    let id_disciplina = parseInt(req.query["id_disciplina"]);
    res.json(isNaN(id_disciplina) ? null : await Disciplina.obter(id_disciplina));
}));
router.post("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let d = req.body;
    jsonRes(res, 400, d ? await Disciplina.criar(d) : "Dados inválidos!");
}));
router.post("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let d = req.body;
    if (d)
        d.id_disciplina = parseInt(req.body.id_disciplina);
    jsonRes(res, 400, (d && !isNaN(d.id_curso)) ? await Disciplina.alterar(d) : "Dados inválidos!");
}));
router.get("/excluir", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id_disciplina = parseInt(req.query["id_disciplina"]);
    jsonRes(res, 400, isNaN(id_disciplina) ? "Dados inválidos!" : await Disciplina.excluir(id_disciplina));
}));
module.exports = router;
//# sourceMappingURL=disciplina.js.map