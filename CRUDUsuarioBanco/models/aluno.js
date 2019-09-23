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
module.exports = class Aluno {
    static validar(a) {
        a.nome_aluno = (a.nome_aluno || "").trim().toUpperCase();
        if (a.nome_aluno.length < 3 || a.nome_aluno.length > 50)
            return "Nome inválido";
        return null;
    }
    static listar() {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id_aluno, nome_aluno,data_nascimento_aluno from aluno where id_curso=id_curso order by nome asc"));
            }));
            return (lista || []);
        });
    }
    static obter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id_aluno, nome_aluno,data_nascimento_aluno,id_curso from aluno where id_aluno = " + id));
            }));
            return ((lista && lista[0]) || null);
        });
    }
    static criar(a) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Aluno.validar(a)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sql.query("insert into aluno (nome_aluno,data_nascimento_aluno,id_curso) values (?,?,?)", [a.nome_aluno, a.data_nascimento_aluno, a.id_curso]);
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "O Aluno \"" + a.nome_aluno + "\" já existe";
                    else
                        throw e;
                }
            }));
            return res;
        });
    }
    static alterar(a) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Aluno.validar(a)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sql.query("update aluno set nome_aluno = ?,data_nascimento_aluno =?,id_curso where id_aluno = " + a.id_curso, [a.nome_aluno, a.data_nascimento_aluno, a.id_curso]);
                    res = sql.linhasAfetadas.toString();
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "O Aluno \"" + a.nome_aluno + "\" já existe";
                    else
                        throw e;
                }
            }));
            return res;
        });
    }
    static excluir(id_aluno) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("delete from aluno where id_aluno = " + id_aluno);
                res = sql.linhasAfetadas.toString();
            }));
            return res;
        });
    }
};
//# sourceMappingURL=aluno.js.map