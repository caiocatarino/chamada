import Sql = require("../infra/sql");

export = class CarteiraAcesso {
    public id_carteiraacesso: number;
    public validade_carteiraAcesso: string;
    public id_aluno: number;

    private static validar(c: CarteiraAcesso): string {
        //c.nome_aluno = (c.nome_aluno || "").trim().toUpperCase();
        //if (c.nome_aluno.length < 3 || c.nome_aluno.length > 50)
           // return "Nome inválido";
        return null;
    }

    public static async listar(): Promise<CarteiraAcesso[]> {
        let lista: CarteiraAcesso[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select id_carteraacesso, validade_carteiraacesso,id_aluno from carteiraacesso where id_aluno=id_aluno order by nome asc") as CarteiraAcesso[];
        });

        return (lista || []);
    }

    public static async obter(id_carteiraacesso: number): Promise<CarteiraAcesso> {
        let lista: CarteiraAcesso[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select id_carteraacesso, validade_carteiraacesso,id_aluno from aluno where id_carteiraacesso = " + id_carteiraacesso) as CarteiraAcesso[];
        });

        return ((lista && lista[0]) || null);
    }

    public static async criar(c: CarteiraAcesso): Promise<string> {
        let res: string;
        if ((res = CarteiraAcesso.validar(c)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("insert into carteiraacesso (validade_carteiraacesso,id_aluno) values (?,?)", [c.validade_carteiraAcesso, c.id_aluno]);
            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "A Carteira de Acesso do aluno  \"" + c.id_aluno + "\" já existe";
                else
                    throw e;
            }
        });

        return res;
    }

    public static async alterar(c: CarteiraAcesso): Promise<string> {
        let res: string;
        if ((res = CarteiraAcesso.validar(c)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("update carteiraacesso set id_carteiraacesso= ?,validade_carteiraacesso=?,id_aluno where id_carteiraacesso= " + c.id, [c.id_carteiraacesso, c.validade_carteiraAcesso, c.id_aluno]);
                res = sql.linhasAfetadas.toString();
            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "A Carteira de Acesso do aluno  \"" + c.id_aluno + "\" já existe";
                else
                    throw e;
            }
        });

        return res;
    }

    public static async excluir(id_carteiraacesso: number): Promise<string> {
        let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("delete from carteiraaaluno where id_carteiraacesso = " + id_carteiraacesso);
            res = sql.linhasAfetadas.toString();
        });

        return res;
    }
}