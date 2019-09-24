"use strict";
const Sql = require("../infra/sql");
const converteData = require("../utils/converteData");
module.exports = class Aluno {
    static validar(a) {
        a.nome_aluno = (a.nome_aluno || "").trim().toUpperCase();
        if (a.nome_aluno.length < 3 || a.nome_aluno.length > 50)
            return "Nome inválido";
        a.data_nascimento_aluno = converteData(a.data_nascimento_aluno);
        if (!a.data_nascimento_aluno)
            return "Data inválida!";
        return null;
    }
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select a.id_aluno, a.nome_aluno,date_format(a.data_nascimento_aluno,'%d/%m/%Y' ) data_nascimento_aluno, c.id_curso, c.nome_curso from aluno a, curso c where a.id_curso = c.id_curso order by nome_aluno asc");
        });
        return (lista || []);
    }
    static async obter(id_aluno) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select a.id_aluno, a.nome_aluno,date_format(a.data_nascimento_aluno,'%d/%m/%Y' ) data_nascimento_aluno, c.id_curso, c.nome_curso from aluno a, curso c where a.id_curso = c.id_curso and a.id_aluno = " + id_aluno);
        });
        return ((lista && lista[0]) || null);
    }
    static async criar(a) {
        let res;
        if ((res = Aluno.validar(a)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into aluno (nome_aluno,data_nascimento_aluno,id_curso) values (?,?,?)", [a.nome_aluno, a.data_nascimento_aluno, a.id_curso]);
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "O aluno \"" + a.nome_aluno + "\" já existe";
                else
                    throw e;
            }
        });
        return res;
    }
    static async alterar(a) {
        let res;
        if ((res = Aluno.validar(a)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update aluno set nome_aluno = ?,data_nascimento_aluno = ?, id_curso = ? where id_aluno = " + a.id_aluno, [a.nome_aluno, a.data_nascimento_aluno, a.id_curso]);
                res = sql.linhasAfetadas.toString();
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "O Aluno \"" + a.nome_aluno + "\" já existe";
                else
                    throw e;
            }
        });
        return res;
    }
    static async excluir(id_aluno) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from aluno where id_aluno = " + id_aluno);
            res = sql.linhasAfetadas.toString();
        });
        return res;
    }
};
//# sourceMappingURL=aluno.js.map