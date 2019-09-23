"use strict";
const Sql = require("../infra/sql");
module.exports = class Professor {
    static validar(p) {
        p.nome_professor = (p.nome_professor || "").trim().toUpperCase();
        if (p.nome_professor.length < 3 || p.nome_professor.length > 50)
            return "Nome inválido";
        return null;
    }
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select id_professor, nome_professor from professor order by nome_professor asc");
        });
        return (lista || []);
    }
    static async obter(id_professor) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select id_professor, nome_professor from professor where id_professor = " + id_professor);
        });
        return ((lista && lista[0]) || null);
    }
    static async criar(p) {
        let res;
        if ((res = Professor.validar(p)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into professor (nome_professor) values (?)", [p.nome_professor]);
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "O curso \"" + p.nome_professor + "\" já existe";
                else
                    throw e;
            }
        });
        return res;
    }
    static async alterar(p) {
        let res;
        if ((res = Professor.validar(p)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update professor set nome_professor = ? where id_professor = " + p.id_professor, [p.nome_professor]);
                res = sql.linhasAfetadas.toString();
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "O professor \"" + p.nome_professor + "\" já existe";
                else
                    throw e;
            }
        });
        return res;
    }
    static async excluir(id_professor) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from professor where id_professor = " + id_professor);
            res = sql.linhasAfetadas.toString();
        });
        return res;
    }
};
//# sourceMappingURL=professor.js.map