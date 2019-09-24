"use strict";
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
    static async listar() {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select id_disciplina, d.nome_disciplina, d.carga_horaria_disciplina, d.semestre_materia, d.ano_disciplina, d.presenca_aberta, p.id_professor, nome_professor, c.id_curso, nome_curso from disciplina as d inner join professor as p on p.id_professor = d.id_professor inner join curso as c on c.id_curso = d.id_curso order by nome_disciplina asc");
        });
        return (lista || []);
    }
    static async obter(id_disciplina) {
        let lista = null;
        await Sql.conectar(async (sql) => {
            lista = await sql.query("select d.id_disciplina, s.nome_disciplina,d.carga_horaria_disciplina, d.semestre_materia, " +
                +" d.ano_disciplina, d.presenca_aberta, p.id_professor, p.nome_professor, " +
                +" c.id_curso, c.nome_curso from disciplina d, professor p, curso c where d.id_professor = p.id_professor " +
                +" and d.id_curso = c.id_curso and id_disciplina = ?  ", [id_disciplina]);
        });
        if (lista && lista[0]) {
            return lista[0];
        }
        else {
            return null;
        }
        //return ((lista && lista[0]) || null);
    }
    static async criar(d) {
        let res;
        if ((res = Disciplina.validar(d)))
            return res;
        await Sql.conectar(async (sql) => {
            await sql.query("insert into disciplina (nome_disciplina,carga_horaria_disciplina,semestre_materia,ano_disciplina, presenca_aberta, id_professor,id_curso) values (?,?,?,?,?,?,?)", [d.nome_disciplina, d.carga_horaria_disciplina, d.semestre_materia, d.ano_disciplina, d.presenca_aberta, d.id_professor, d.id_curso]);
        });
    }
    static async alterar(d) {
        let res;
        if ((res = Disciplina.validar(d)))
            return res;
        await Sql.conectar(async (sql) => {
            await sql.query("update disciplina set nome_disciplina = ?, carga_horaria_disciplina = ?, semestre_materia = ?, ano_disciplina = ?, presenca_aberta = ?, id_professor = ?, id_curso = ? where id_disciplina = ?", [d.nome_disciplina, d.presenca_aberta, d.semestre_materia, d.ano_disciplina, d.presenca_aberta, d.id_professor, d.id_curso]);
            res = sql.linhasAfetadas.toString();
        });
    }
    static async excluir(id_disciplina) {
        let res = null;
        await Sql.conectar(async (sql) => {
            await sql.query("delete from disciplina where id_disciplina = " + id_disciplina);
            res = sql.linhasAfetadas.toString();
        });
        return res;
    }
};
//# sourceMappingURL=disciplina.js.map