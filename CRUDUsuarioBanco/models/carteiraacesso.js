"use strict";
const Sql = require("../infra/sql");
const converteData = require("../utils/converteData");
module.exports = class CarteiraAcesso {
    static validar(c) {
        c.validade_carteiraAcesso = converteData(c.validade_carteiraAcesso);
        if (!c.validade_carteiraAcesso)
            return "Data inválida!";
        return null;
    }
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select date_format(c.validade_carteiraAcesso,'%d/%m/%Y' ) validade_carteiraAcesso, a.nome_aluno, a.id_aluno, c.id_carteiraAcesso from carteiraAcesso c, aluno a where c.id_aluno = a.id_aluno");
        });
        return (lista || []);
    }
    static async obter(id_carteiraAcesso) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select date_format(c.validade_carteiraAcesso,'%d/%m/%Y' ) validade_carteiraAcesso, a.id_aluno, a.nome_aluno, c.id_carteiraAcesso from carteiraAcesso c, aluno a where c.id_aluno = a.id_aluno and id_carteiraAcesso =   " + id_carteiraAcesso);
        });
        return ((lista && lista[0]) || null);
    }
    static async criar(c) {
        let res;
        if ((res = CarteiraAcesso.validar(c)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("insert into carteiraAcesso (validade_carteiraAcesso,id_aluno) values (?,?)", [c.validade_carteiraAcesso, c.id_aluno]);
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "A Carteira de Acesso \"" + c.id_carteiraAcesso + "\" já existe";
                else
                    throw e;
            }
        });
        return res;
    }
    static async alterar(c) {
        let res;
        if ((res = CarteiraAcesso.validar(c)))
            return res;
        await Sql.conectar(async (sql) => {
            try {
                await sql.query("update carteiraAcesso set validade_carteiraAcesso = ?, id_aluno = ? where id_carteiraAcesso = " + c.id_carteiraAcesso, [c.validade_carteiraAcesso, c.id_aluno]);
                res = sql.linhasAfetadas.toString();
            }
            catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "A Carteira de Acesso \"" + c.id_carteiraAcesso + "\" já existe";
                else
                    throw e;
            }
        });
        return res;
    }
    static async excluir(id_carteiraAcesso) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from carteiraAcesso where id_carteiraAcesso = " + id_carteiraAcesso);
            res = sql.linhasAfetadas.toString();
        });
        return res;
    }
};
//# sourceMappingURL=carteiraAcesso.js.map