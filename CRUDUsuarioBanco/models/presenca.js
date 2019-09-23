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
module.exports = class Presenca {
    static validar(p) {
        return null;
    }
    static listar() {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id_presenca, data,id_aluno,id_disciplina from aluno where id_curso=id_curso order by nome asc"));
            }));
            return (lista || []);
        });
    }
    static obter(id_presenca) {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id_presenca, data,id_aluno,id_disciplina from presenca where id_presenca = " + id_presenca));
            }));
            return ((lista && lista[0]) || null);
        });
    }
    static criar(p) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Presenca.validar(p)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sql.query("insert into presenca (data,id_aluno,id_disciplina) values (?,?,?)", [p.data, p.id_aluno, p.id_disciplina]);
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "A Presença \"" + p.id_disciplina + "\" já existe";
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
            if ((res = Presenca.validar(p)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sql.query("update aluno set nome_aluno = ?,data_nascimento_aluno =?,id_curso where id_aluno = " + a.id, [a.nome_aluno, a.data_nascimento_aluno, a.id_curso]);
                    res = sql.linhasAfetadas.toString();
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "A presença \"" + p.id_presenca + "\" já existe";
                    else
                        throw e;
                }
            }));
            return res;
        });
    }
    static excluir(id_presenca) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("delete from presenca where id_presenca = " + id_presenca);
                res = sql.linhasAfetadas.toString();
            }));
            return res;
        });
    }
};
//# sourceMappingURL=presenca.js.map