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
module.exports = class Curso {
    static validar(c) {
        c.nome = (c.nome || "").trim().toUpperCase();
        if (c.nome.length < 3 || c.nome.length > 50)
            return "Nome inválido";
        return null;
    }
    static listar() {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id, nome from curso order by nome asc"));
            }));
            return (lista || []);
        });
    }
    static obter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id, nome from curso where id = " + id));
            }));
            return ((lista && lista[0]) || null);
        });
    }
    static criar(c) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Curso.validar(c)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sql.query("insert into curso (nome) values (?)", [c.nome]);
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "O curso \"" + c.nome + "\" já existe";
                    else
                        throw e;
                }
            }));
            return res;
        });
    }
    static alterar(c) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Curso.validar(c)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sql.query("update curso set nome = ? where id = " + c.id, [c.nome]);
                    res = sql.linhasAfetadas.toString();
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "O curso \"" + c.nome + "\" já existe";
                    else
                        throw e;
                }
            }));
            return res;
        });
    }
    static excluir(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("delete from curso where id = " + id);
                res = sql.linhasAfetadas.toString();
            }));
            return res;
        });
    }
};
//# sourceMappingURL=curso.js.map