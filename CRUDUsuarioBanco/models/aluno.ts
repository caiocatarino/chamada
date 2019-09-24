import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");

export = class Aluno {
	public id_aluno: number;
	public nome_aluno: string;
	public data_nascimento_aluno: string;

	public id_curso:number;

	private static validar(a: Aluno): string {
		a.nome_aluno = (a.nome_aluno || "").trim().toUpperCase();
		if (a.nome_aluno.length < 3 || a.nome_aluno.length > 50)
			return "Nome inválido";
		a.data_nascimento_aluno = converteData(a.data_nascimento_aluno);
			if (!a.data_nascimento_aluno)
				return "Data inválida!"; 

		return null;
	}

	public static async listar(): Promise<Aluno[]> {
		let lista: Aluno[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select a.id_aluno, a.nome_aluno,date_format(a.data_nascimento_aluno,'%d/%m/%Y' ) data_nascimento_aluno, c.id_curso, c.nome_curso from aluno a, curso c where a.id_curso = c.id_curso order by nome_aluno asc") as Aluno[];
		});

		return (lista || []);
	}

	public static async obter(id_aluno: number): Promise<Aluno> {
		let lista: Aluno[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select a.id_aluno, a.nome_aluno,date_format(a.data_nascimento_aluno,'%d/%m/%Y' ) data_nascimento_aluno, c.id_curso, c.nome_curso from aluno a, curso c where a.id_curso = c.id_curso and a.id_aluno = " + id_aluno) as Aluno[];
		});

		return ((lista && lista[0]) || null);
	}

	public static async criar(a: Aluno): Promise<string> {
		let res: string;
		if ((res = Aluno.validar(a)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("insert into aluno (nome_aluno,data_nascimento_aluno,id_curso) values (?,?,?)", [a.nome_aluno,a.data_nascimento_aluno,a.id_curso]);
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = "O aluno \"" + a.nome_aluno + "\" já existe";
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
				await sql.query("update aluno set nome_aluno = ?,data_nascimento_aluno = ?, id_curso = ? where id_aluno = " + a.id_aluno, [a.nome_aluno,a.data_nascimento_aluno,a.id_curso]);
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
