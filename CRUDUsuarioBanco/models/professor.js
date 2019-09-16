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
module.exports = class Professor {
    static validar(p) {
        p.nome_professor = (p.nome_professor || "").trim().toUpperCase();
        if (p.nome_professor.length < 3 || p.nome_professor.length > 50)
            return "Nome inválido";
        return null;
    }
    static listar() {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id_professor, nome_professor from professor order by nome_professor asc"));
            }));
            return (lista || []);
        });
    }
    static obter(id_professor) {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id_professor, nome_professor from professor where id_professor = " + id_professor));
            }));
            return ((lista && lista[0]) || null);
        });
    }
    static criar(p) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Professor.validar(p)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sql.query("insert into professor (nome_professor) values (?)", [p.nome_professor]);
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "O curso \"" + p.nome_professor + "\" já existe";
                    else
                        throw e;
                }
            }));
            return res;
        });
    }
    static alterar(p) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Professor.validar(p)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sql.query("update professor set nome_professor = ? where id_professor = " + p.id_professor, [p.nome_professor]);
                    res = sql.linhasAfetadas.toString();
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "O professor \"" + p.nome_professor + "\" já existe";
                    else
                        throw e;
                }
            }));
            return res;
        });
    }
    static excluir(id_professor) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("delete from professor where id_professor = " + id_professor);
                res = sql.linhasAfetadas.toString();
            }));
            return res;
        });
    }
};
//# sourceMappingURL=professor.js.map