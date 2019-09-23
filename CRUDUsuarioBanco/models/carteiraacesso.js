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
module.exports = class CarteiraAcesso {
    static validar(c) {
        //c.nome_aluno = (c.nome_aluno || "").trim().toUpperCase();
        //if (c.nome_aluno.length < 3 || c.nome_aluno.length > 50)
        // return "Nome inválido";
        return null;
    }
    static listar() {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id_carteraacesso, validade_carteiraacesso,id_aluno from carteiraacesso where id_aluno=id_aluno order by nome asc"));
            }));
            return (lista || []);
        });
    }
    static obter(id_carteiraacesso) {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id_carteraacesso, validade_carteiraacesso,id_aluno from aluno where id_carteiraacesso = " + id_carteiraacesso));
            }));
            return ((lista && lista[0]) || null);
        });
    }
    static criar(c) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = CarteiraAcesso.validar(c)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sql.query("insert into carteiraacesso (validade_carteiraacesso,id_aluno) values (?,?)", [c.validade_carteiraAcesso, c.id_aluno]);
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "A Carteira de Acesso do aluno  \"" + c.id_aluno + "\" já existe";
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
            if ((res = CarteiraAcesso.validar(c)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sql.query("update carteiraacesso set id_carteiraacesso= ?,validade_carteiraacesso=?,id_aluno where id_carteiraacesso= " + c.id, [c.id_carteiraacesso, c.validade_carteiraAcesso, c.id_aluno]);
                    res = sql.linhasAfetadas.toString();
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "A Carteira de Acesso do aluno  \"" + c.id_aluno + "\" já existe";
                    else
                        throw e;
                }
            }));
            return res;
        });
    }
    static excluir(id_carteiraacesso) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("delete from carteiraaaluno where id_carteiraacesso = " + id_carteiraacesso);
                res = sql.linhasAfetadas.toString();
            }));
            return res;
        });
    }
};
//# sourceMappingURL=carteiraacesso.js.map