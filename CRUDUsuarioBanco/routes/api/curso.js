"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const jsonRes = require("../../utils/jsonRes");
const Usuario = require("../../models/usuario");
const Curso = require("../../models/curso");
const router = express.Router();
router.get("/listar", wrap(async (req, res) => {
    res.json(await Curso.listar());
}));
router.get("/obter", wrap(async (req, res) => {
    let id_curso = parseInt(req.query["id_curso"]);
    res.json(isNaN(id_curso) ? null : await Curso.obter(id_curso));
}));
router.post("/criar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let c = req.body;
    jsonRes(res, 400, c ? await Curso.criar(c) : "Dados inválidos!");
}));
router.post("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let c = req.body;
    if (c)
        c.id_curso = parseInt(req.body.id_curso);
    jsonRes(res, 400, (c && !isNaN(c.id_curso)) ? await Curso.alterar(c) : "Dados inválidos!");
}));
router.get("/excluir", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id_curso = parseInt(req.query["id_curso"]);
    jsonRes(res, 400, isNaN(id_curso) ? "Dados inválidos!" : await Curso.excluir(id_curso));
}));
module.exports = router;
//# sourceMappingURL=curso.js.map