import Sql = require("../infra/sql");

export = class Presenca {
    public id_presenca: number;
    public data: string;
    public id_aluno: number;
    public id_disciplina: number;

    private static validar(p: Presenca): string {
        
        return null;
    }

    public static async listar(): Promise<Presenca[]> {
        let lista: Presenca[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select id_presenca, data,id_aluno,id_disciplina from aluno where id_curso=id_curso order by nome asc") as Presenca[];
        });

        return (lista || []);
    }

    public static async obter(id_presenca: number): Promise<Presenca> {
        let lista: Presenca[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select id_presenca, data,id_aluno,id_disciplina from presenca where id_presenca = " + id_presenca) as Presenca[];
        });

        return ((lista && lista[0]) || null);
    }

    public static async criar(p: Presenca): Promise<string> {
        let res: string;
        if ((res = Presenca.validar(p)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into presenca (data,id_aluno,id_disciplina) values (?,?,?)", [p.data, p.id_aluno, p.id_disciplina]);
            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "A Presença \"" + p.id_disciplina + "\" já existe";
                else
                    throw e;
            }
        });

        return res;
    }

    public static async alterar(p: Presenca): Promise<string> {
        let res: string;
        if ((res = Presenca.validar(p)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("update aluno set nome_aluno = ?,data_nascimento_aluno =?,id_curso where id_aluno = " + a.id, [a.nome_aluno, a.data_nascimento_aluno, a.id_curso]);
                res = sql.linhasAfetadas.toString();
            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "A presença \"" + p.id_presenca + "\" já existe";
                else
                    throw e;
            }
        });

        return res;
    }

    public static async excluir(id_presenca: number): Promise<string> {
        let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("delete from presenca where id_presenca = " + id_presenca);
            res = sql.linhasAfetadas.toString();
        });

        return res;
    }
}