"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Sql = require("../infra/sql");
module.exports = class Contato {
    static validar(c) {
        c.nome = (c.nome || "").trim().toUpperCase();
        if (c.nome.length < 3 || c.nome.length > 200)
            return "Nome inválido";
        c.endereco = (c.endereco || "").trim().toUpperCase();
        if (c.endereco.length < 3 || c.endereco.length > 200)
            return "Endereço inválido";
        c.email = (c.email || "").trim().toUpperCase();
        if (c.email.length < 3 || c.email.length > 200)
            return "Email inválido";
        if (c.peso <= 0)
            return "Peso inválido!";
        return null;
    }
    static listar() {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id, nome, endereco, email, peso from contato order by nome asc"));
            }));
            return (lista || []);
        });
    }
    static obter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id, nome, endereco, email, peso from contato where id = ?", [id]));
            }));
            if (lista && lista[0]) {
                return lista[0];
            }
            else {
                return null;
            }
            //return ((lista && lista[0]) || null);
        });
    }
    static criar(c) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Contato.validar(c)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("insert into contato (nome,endereco,email,peso) values (?,?,?,?)", [c.nome, c.endereco, c.email, c.peso]);
            }));
        });
    }
    static alterar(c) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Contato.validar(c)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("update contato set nome = ?, endereco = ?, email = ?, peso = ? where id = ?", [c.nome, c.endereco, c.email, c.peso, c.id]);
                res = sql.linhasAfetadas.toString();
            }));
        });
    }
    static excluir(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("delete from contato where id = " + id);
                res = sql.linhasAfetadas.toString();
            }));
            return res;
        });
    }
};
//# sourceMappingURL=contato.js.map