"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const wrap = require("express-async-error-wrapper");
const jsonRes = require("../../utils/jsonRes");
const Usuario = require("../../models/usuario");
const Curso = require("../../models/curso");
const router = express.Router();
router.get("/listar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    res.json(yield Curso.listar());
})));
router.get("/obter", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let id = parseInt(req.query["id"]);
    res.json(isNaN(id) ? null : yield Curso.obter(id));
})));
router.post("/criar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let c = req.body;
    jsonRes(res, 400, c ? yield Curso.criar(c) : "Dados inválidos!");
})));
router.post("/alterar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let c = req.body;
    if (c)
        c.id = parseInt(req.body.id);
    jsonRes(res, 400, (c && !isNaN(c.id)) ? yield Curso.alterar(c) : "Dados inválidos!");
})));
router.get("/excluir", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id = parseInt(req.query["id"]);
    jsonRes(res, 400, isNaN(id) ? "Dados inválidos!" : yield Curso.excluir(id));
})));
module.exports = router;
//# sourceMappingURL=curso.js.map