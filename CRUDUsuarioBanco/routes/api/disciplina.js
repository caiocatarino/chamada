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
const Disciplina = require("../../models/disciplina");
const router = express.Router();
router.get("/listar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    res.json(yield Disciplina.listar());
})));
router.get("/obter", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let id_disciplina = parseInt(req.query["id_disciplina"]);
    res.json(isNaN(id_disciplina) ? null : yield Disciplina.obter(id_disciplina));
})));
router.post("/criar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    //let u = await Usuario.cookie(req, res, true);
    //if (!u)
    //	return;
    let d = req.body;
    jsonRes(res, 400, d ? yield Disciplina.criar(d) : "Dados inválidos!");
})));
router.post("/alterar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let d = req.body;
    if (d)
        d.id_disciplina = parseInt(req.body.id_disciplina);
    jsonRes(res, 400, (d && !isNaN(d.id_curso)) ? yield Disciplina.alterar(d) : "Dados inválidos!");
})));
router.get("/excluir", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id_disciplina = parseInt(req.query["id_disciplina"]);
    jsonRes(res, 400, isNaN(id_disciplina) ? "Dados inválidos!" : yield Disciplina.excluir(id_disciplina));
})));
module.exports = router;
//# sourceMappingURL=disciplina.js.map