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
const Professor = require("../../models/professor");
const router = express.Router();
router.get("/listar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    res.json(yield Professor.listar());
})));
router.get("/obter", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let id_professor = parseInt(req.query["id_professor"]);
    res.json(isNaN(id_professor) ? null : yield Professor.obter(id_professor));
})));
router.post("/criar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    //let u = await Usuario.cookie(req, res, true);
    //if (!u)
    //	return;
    let p = req.body;
    jsonRes(res, 400, p ? yield Professor.criar(p) : "Dados inválidos!");
})));
router.post("/alterar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let p = req.body;
    if (p)
        p.id_professor = parseInt(req.body.id_professor);
    jsonRes(res, 400, (p && !isNaN(p.id_professor)) ? yield Professor.alterar(p) : "Dados inválidos!");
})));
router.get("/excluir", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id_professor = parseInt(req.query["id_professor"]);
    jsonRes(res, 400, isNaN(id_professor) ? "Dados inválidos!" : yield Professor.excluir(id_professor));
})));
module.exports = router;
//# sourceMappingURL=professor.js.map