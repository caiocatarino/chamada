import Sql = require("../infra/sql");

export = class Curso {
	public id_curso: number;
	public nome_curso: string;

	private static validar(c: Curso): string {
		c.nome_curso = (c.nome_curso || "").trim().toUpperCase();
		if (c.nome_curso.length < 3 || c.nome_curso.length > 50)
			return "Nome inválido";
		return null;
	}

	public static async listar(): Promise<Curso[]> {
		let lista: Curso[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select id_curso, nome_curso from curso order by nome_curso asc") as Curso[];
		});

		return (lista || []);
	}

	public static async obter(id_curso: number): Promise<Curso> {
		let lista: Curso[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select id_curso, nome_curso from curso where id_curso = " + id_curso) as Curso[];
		});

		return ((lista && lista[0]) || null);
	}

	public static async criar(c: Curso): Promise<string> {
		let res: string;
		if ((res = Curso.validar(c)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("insert into curso (nome_curso) values (?)", [c.nome_curso]);
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = "O curso \"" + c.nome_curso + "\" já existe";
				else
					throw e;
			}
		});

		return res;
	}

	public static async alterar(c: Curso): Promise<string> {
		let res: string;
		if ((res = Curso.validar(c)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("update curso set nome_curso = ? where id_curso = " + c.id_curso, [c.nome_curso]);
				res = sql.linhasAfetadas.toString();
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = "O curso \"" + c.nome_curso + "\" já existe";
				else
					throw e;
			}
		});

		return res;
	}

	public static async excluir(id_curso: number): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
			await sql.query("delete from curso where id_curso = " + id_curso);
			res = sql.linhasAfetadas.toString();
		});

		return res;
	}
}
