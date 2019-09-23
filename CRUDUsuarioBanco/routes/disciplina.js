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
const Usuario = require("../models/usuario");
const Disciplina = require("../models/disciplina");
const router = express.Router();
router.all("/criar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    //let u = await Usuario.cookie(req);
    //if (!u || !u.admin) {
    //	res.redirect("/acesso");
    //} else {
    res.render("disciplina/alterar", { titulo: "Criar Disciplina", item: null });
    //}
})));
router.all("/alterar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        let id_disciplina = parseInt(req.query["id_disciplina"]);
        let item = null;
        if (isNaN(id_disciplina) || !(item = yield Disciplina.obter(id_disciplina)))
            res.render("shared/nao-encontrado", { usuario: u });
        else
            res.render("disciplina/alterar", { titulo: "Editar Disciplina", usuario: u, item: item });
    }
})));
router.get("/listar", wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
    let u = yield Usuario.cookie(req);
    if (!u || !u.admin) {
        res.redirect("/acesso");
    }
    else {
        res.render("disciplina/listar", { titulo: "Gerenciar Disciplinas", usuario: u, lista: JSON.stringify(yield Disciplina.listar()) });
    }
})));
module.exports = router;
//# sourceMappingURL=disciplina.js.map