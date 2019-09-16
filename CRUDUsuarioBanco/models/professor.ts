import Sql = require("../infra/sql");

export = class Professor {
	public id_professor: number;
	public nome_professor: string;

	private static validar(p: Professor): string {
		p.nome_professor = (p.nome_professor || "").trim().toUpperCase();
		if (p.nome_professor.length < 3 || p.nome_professor.length > 50)
			return "Nome inválido";
		return null;
	}

	public static async listar(): Promise<Professor[]> {
		let lista: Professor[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select id_professor, nome_professor from professor order by nome_professor asc") as Professor[];
		});

		return (lista || []);
	}

	public static async obter(id_professor: number): Promise<Professor> {
		let lista: Professor[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select id_professor, nome_professor from professor where id_professor = " + id_professor) as Professor[];
		});

		return ((lista && lista[0]) || null);
	}

	public static async criar(p: Professor): Promise<string> {
		let res: string;
		if ((res = Professor.validar(p)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("insert into professor (nome_professor) values (?)", [p.nome_professor]);
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = "O curso \"" + p.nome_professor + "\" já existe";
				else
					throw e;
			}
		});

		return res;
	}

	public static async alterar(p: Professor): Promise<string> {
		let res: string;
		if ((res = Professor.validar(p)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("update professor set nome_professor = ? where id_professor = " + p.id_professor, [p.nome_professor]);
				res = sql.linhasAfetadas.toString();
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = "O professor \"" + p.nome_professor + "\" já existe";
				else
					throw e;
			}
		});

		return res;
	}

	public static async excluir(id_professor: number): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
			await sql.query("delete from professor where id_professor = " + id_professor);
			res = sql.linhasAfetadas.toString();
		});

		return res;
	}
}
