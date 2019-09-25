"use strict";
const Sql = require("../infra/sql");
const converteData = require("../utils/converteData");
module.exports = class Presenca {
    static validar(p) {
        p.data = converteData(p.data);
        if (!p.data)
            return "Data inválida!";
        return null;
    }
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select p.id_presenca, date_format(p.data,'%d/%m/%Y' ) data, a.id_aluno, a.nome_aluno, d.id_disciplina,d.nome_disciplina from presenca p, aluno a, disciplina d where p.id_aluno = a.id_aluno and p.id_disciplina = d.id_disciplina ");
        });
        return (lista || []);
    }
    static async obter(id_presenca) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select p.id_presenca, date_format(p.data,'%d/%m/%Y' ) data, a.id_aluno, a.nome_aluno, d.id_disciplina,d.nome_disciplina from presenca p, aluno a, disciplina d where p.id_aluno = a.id_aluno and p.id_disciplina = d.id_disciplina and id_presenca = " + id_presenca);
        });
        return ((lista && lista[0]) || null);
    }
    static async criar(p) {
        let res;
        if ((res = Presenca.validar(p)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into presenca (data,id_aluno,id_disciplina) values (?,?,?)", [p.data, p.id_aluno, p.id_disciplina]);
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "A Presença \"" + p.id_presenca + "\" já existe";
                else
                    throw e;
            }
        });
        return res;
    }
    static async alterar(p) {
        let res;
        if ((res = Presenca.validar(p)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update presenca set data = ?, id_aluno = ?, id_disciplina = ? where id_disciplina = " + p.id_disciplina, [p.data, p.id_aluno, p.id_disciplina]);
                res = sql.linhasAfetadas.toString();
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "A presença \"" + p.id_presenca + "\" já existe";
                else
                    throw e;
            }
        });
        return res;
    }
    static async excluir(id_presenca) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from presenca where id_presenca = " + id_presenca);
            res = sql.linhasAfetadas.toString();
        });
        return res;
    }
};
//# sourceMappingURL=presenca.js.map