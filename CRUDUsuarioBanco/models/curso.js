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
        c.nome_curso = (c.nome_curso || "").trim().toUpperCase();
        if (c.nome_curso.length < 3 || c.nome_curso.length > 50)
            return "Nome inválido";
        return null;
    }
    static listar() {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id_curso, nome_curso from curso order by nome_curso asc"));
            }));
            return (lista || []);
        });
    }
    static obter(id_curso) {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id_curso, nome_curso from curso where id_curso = " + id_curso));
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
                    yield sql.query("insert into curso (nome_curso) values (?)", [c.nome_curso]);
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "O curso \"" + c.nome_curso + "\" já existe";
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
                    yield sql.query("update curso set nome_curso = ? where id_curso = " + c.id_curso, [c.nome_curso]);
                    res = sql.linhasAfetadas.toString();
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "O curso \"" + c.nome_curso + "\" já existe";
                    else
                        throw e;
                }
            }));
            return res;
        });
    }
    static excluir(id_curso) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("delete from curso where id_curso = " + id_curso);
                res = sql.linhasAfetadas.toString();
            }));
            return res;
        });
    }
};
//# sourceMappingURL=curso.js.map