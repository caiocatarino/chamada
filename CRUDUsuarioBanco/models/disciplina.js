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
module.exports = class Disciplina {
    static validar(d) {
        d.nome_disciplina = (d.nome_disciplina || "").trim().toUpperCase();
        if (d.nome_disciplina.length < 3 || d.nome_disciplina.length > 200)
            return "Nome inválido";
        if (d.carga_horaria_disciplina <= 0)
            return "Carga horária inválido!";
        if (d.semestre_materia <= 0)
            return "Semestre inválido!";
        return null;
    }
    static listar() {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select d.id_disciplina, d.nome_disciplina, d.carga_horaria_disciplina, d.semestre_materia, d.ano_disciplina, d.presenca_aberta, p.id_professor, p.nome_professor, c.id_curso, c.nome_curso from disciplina d, professor f, curso c where d.id_disciplina = p.professor  order by nome asc"));
            }));
            return (lista || []);
        });
    }
    static obter(id_disciplina) {
        return __awaiter(this, void 0, void 0, function* () {
            let lista = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                lista = (yield sql.query("select id, nome, endereco, email, peso from contato where id = ?", [id_disciplina]));
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
    static criar(d) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Disciplina.validar(d)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("insert into disciplina (nome_disciplina,carga_horaria_disciplina,semestre_materia,ano_disciplina, presenca_aberta, id_professor,id_curso) values (?,?,?,?,?,?,?)", [d.nome_disciplina, d.carga_horaria_disciplina, d.semestre_materia, d.ano_disciplina, d.presenca_aberta, d.id_professor, d.id_curso]);
            }));
        });
    }
    static alterar(d) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if ((res = Disciplina.validar(d)))
                return res;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("update disciplina set nome_disciplina = ?, carga_horaria_disciplina = ?, semestre_materia = ?, ano_disciplina = ?, presenca_aberta = ?, id_professor = ?, id_curso = ? where id_disciplina = ?", [d.nome_disciplina, d.presenca_aberta, d.semestre_materia, d.ano_disciplina, d.presenca_aberta, d.id_professor, d.id_curso]);
                res = sql.linhasAfetadas.toString();
            }));
        });
    }
    static excluir(id_disciplina) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = null;
            yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                yield sql.query("delete from disciplina where id_disciplina = " + id_disciplina);
                res = sql.linhasAfetadas.toString();
            }));
            return res;
        });
    }
};
//# sourceMappingURL=disciplina.js.map