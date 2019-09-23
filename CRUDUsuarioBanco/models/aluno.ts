import Sql = require("../infra/sql");

export = class Aluno {
    public id_aluno: number;
    public nome_aluno: string;
    public data_nascimento_aluno: string;
    public id_curso: number;

    private static validar(a: Aluno): string {
        a.nome_aluno = (a.nome_aluno || "").trim().toUpperCase();
        if (a.nome_aluno.length < 3 || a.nome_aluno.length > 50)
            return "Nome inválido";
        return null;
    }

    public static async listar(): Promise<Aluno[]> {
        let lista: Aluno[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select id_aluno, nome_aluno,data_nascimento_aluno, c.nome_curso from aluno where id_curso=id_curso order by nome asc") as Aluno[];
        });

        return (lista || []);
    }

    public static async obter(id: number): Promise<Aluno> {
        let lista: Aluno[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select id_aluno, nome_aluno,data_nascimento_aluno,id_curso from aluno where id_aluno = " + id) as Aluno[];
        });

        return ((lista && lista[0]) || null);
    }

    public static async criar(a: Aluno): Promise<string> {
        let res: string;
        if ((res = Aluno.validar(a)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into aluno (nome_aluno,data_nascimento_aluno,id_curso) values (?,?,?)", [a.nome_aluno, a.data_nascimento_aluno, a.id_curso]);
            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "O Aluno \"" + a.nome_aluno + "\" já existe";
                else
                    throw e;
            }
        });

        return res;
    }

    public static async alterar(a: Aluno): Promise<string> {
        let res: string;
        if ((res = Aluno.validar(a)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("update aluno set nome_aluno = ?,data_nascimento_aluno =?,id_curso where id_aluno = " + a.id_curso, [a.nome_aluno, a.data_nascimento_aluno, a.id_curso]);
                res = sql.linhasAfetadas.toString();
            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "O Aluno \"" + a.nome_aluno + "\" já existe";
                else
                    throw e;
            }
        });

        return res;
    }

    public static async excluir(id_aluno: number): Promise<string> {
        let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("delete from aluno where id_aluno = " + id_aluno);
            res = sql.linhasAfetadas.toString();
        });

        return res;
    }
}