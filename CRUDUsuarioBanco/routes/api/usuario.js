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
const router = express.Router();
// Se utilizar router.xxx() mas não utilizar o wrap(), as exceções ocorridas
// dentro da função async não serão tratadas!!!
router.post("/login", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req);
    jsonRes(res, 403, u ? null : yield Usuario.efetuarLogin(req.body.login, req.body.senha, res)[0]);
})));
router.get("/logout", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req);
    if (u)
        yield u.efetuarLogout(res);
    res.sendStatus(204);
})));
router.post("/alterarPerfil", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res);
    if (!u)
        return;
    jsonRes(res, 400, yield u.alterarPerfil(res, req.body.nome, req.body.senhaAtual, req.body.novaSenha));
})));
router.get("/listar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    res.json(yield Usuario.listar());
})));
router.get("/obter", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id = parseInt(req.query["id"]);
    res.json(isNaN(id) ? null : yield Usuario.obter(id));
})));
router.post("/criar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    u = req.body;
    if (u)
        u.tipo = parseInt(req.body.tipo);
    jsonRes(res, 400, u ? yield Usuario.criar(u) : "Dados inválidos");
})));
router.post("/alterar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id = u.id;
    u = req.body;
    if (u) {
        u.id = parseInt(req.body.id);
        u.tipo = parseInt(req.body.tipo);
    }
    jsonRes(res, 400, (u && !isNaN(u.id)) ? (id === u.id ? "Um usuário não pode alterar a si próprio" : yield Usuario.alterar(u)) : "Dados inválidos");
})));
router.get("/excluir", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id = parseInt(req.query["id"]);
    jsonRes(res, 400, isNaN(id) ? "Dados inválidos" : (id === u.id ? "Um usuário não pode excluir a si próprio" : yield Usuario.excluir(id)));
})));
router.get("/redefinirSenha", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req, res, true);
    if (!u)
        return;
    let id = parseInt(req.query["id"]);
    jsonRes(res, 400, isNaN(id) ? "Dados inválidos" : (id === u.id ? "Um usuário não pode redefinir sua própria senha" : yield Usuario.redefinirSenha(id)));
})));
module.exports = router;
//# sourceMappingURL=usuario.js.map