"use strict";
const Sql = require("../infra/sql");
module.exports = class Curso {
    static validar(c) {
        c.nome_curso = (c.nome_curso || "").trim().toUpperCase();
        if (c.nome_curso.length < 3 || c.nome_curso.length > 50)
            return "Nome inválido";
        return null;
    }
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select id_curso, nome_curso from curso order by nome_curso asc");
        });
        return (lista || []);
    }
    static async obter(id_curso) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select id_curso, nome_curso from curso where id_curso = " + id_curso);
        });
        return ((lista && lista[0]) || null);
    }
    static async criar(c) {
        let res;
        if ((res = Curso.validar(c)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into curso (nome_curso) values (?)", [c.nome_curso]);
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "O curso \"" + c.nome_curso + "\" já existe";
                else
                    throw e;
            }
        });
        return res;
    }
    static async alterar(c) {
        let res;
        if ((res = Curso.validar(c)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update curso set nome_curso = ? where id_curso = " + c.id_curso, [c.nome_curso]);
                res = sql.linhasAfetadas.toString();
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "O curso \"" + c.nome_curso + "\" já existe";
                else
                    throw e;
            }
        });
        return res;
    }
    static async excluir(id_curso) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from curso where id_curso = " + id_curso);
            res = sql.linhasAfetadas.toString();
        });
        return res;
    }
};
//# sourceMappingURL=curso.js.map