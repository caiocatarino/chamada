"use strict";
const express = require("express");
const wrap = require("express-async-error-wrapper");
const jsonRes = require("../../utils/jsonRes");
const Usuario = require("../../models/usuario");
const Professor = require("../../models/professor");
const router = express.Router();
router.get("/listar", wrap(async (req, res) => {
    res.json(await Professor.listar());
}));
router.get("/obter", wrap(async (req, res) => {
    let id_professor = parseInt(req.query["id_professor"]);
    res.json(isNaN(id_professor) ? null : await Professor.obter(id_professor));
}));
router.post("/criar", wrap(async (req, res) => {
    //let u = await Usuario.cookie(req, res, true);
    //if (!u)
    //	return;
    let p = req.body;
    jsonRes(res, 400, p ? await Professor.criar(p) : "Dados inválidos!");
}));
router.post("/alterar", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let p = req.body;
    if (p)
        p.id_professor = parseInt(req.body.id_professor);
    jsonRes(res, 400, (p && !isNaN(p.id_professor)) ? await Professor.alterar(p) : "Dados inválidos!");
}));
router.get("/excluir", wrap(async (req, res) => {
    let u = await Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id_professor = parseInt(req.query["id_professor"]);
    jsonRes(res, 400, isNaN(id_professor) ? "Dados inválidos!" : await Professor.excluir(id_professor));
}));
module.exports = router;
//# sourceMappingURL=professor.js.map