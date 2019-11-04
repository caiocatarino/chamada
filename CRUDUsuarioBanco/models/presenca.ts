import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");
export = class Presenca {
	public id_presenca: number;
	public data: string;

	public id_aluno:number;
	public id_disciplina:number;

	private static validar(p: Presenca): string {
		p.data = converteData(p.data);
			if (!p.data)
				return "Data inválida!"; 
		return null;
	}

	public static async listar(): Promise<Presenca[]> {
		let lista: Presenca[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select p.id_presenca, date_format(p.data,'%d/%m/%Y' ) data, a.id_aluno, a.nome_aluno, d.id_disciplina,d.nome_disciplina from presenca p, aluno a, disciplina d where p.id_aluno = a.id_aluno and p.id_disciplina = d.id_disciplina ") as Presenca[];
		});

		return (lista || []);
	}

	public static async listarAlunos(data: string): Promise<Presenca[]> {
		data = converteData(data);

		let lista: Presenca[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select p.id_presenca, date_format(p.data,'%d/%m/%Y' ) data, a.id_aluno, a.nome_aluno, d.id_disciplina,d.nome_disciplina from presenca p, aluno a, disciplina d where p.id_aluno = a.id_aluno and p.id_disciplina = d.id_disciplina and p.data =  ?", [data]) as Presenca[];
		});

		return (lista || []);
	}

	public static async obter(id_presenca: number): Promise<Presenca> {
		let lista: Presenca[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select p.id_presenca, date_format(p.data,'%d/%m/%Y' ) data, a.id_aluno, a.nome_aluno, d.id_disciplina,d.nome_disciplina from presenca p, aluno a, disciplina d where p.id_aluno = a.id_aluno and p.id_disciplina = d.id_disciplina and id_presenca = " + id_presenca) as Presenca[];
		});

		return ((lista && lista[0]) || null);
	}

	public static async criar(p: Presenca): Promise<string> {
		let res: string;
		if ((res = Presenca.validar(p)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("insert into presenca (data,id_aluno,id_disciplina) values (?,?,?)", [p.data,p.id_aluno,p.id_disciplina]);
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = "A Presença \"" + p.id_presenca + "\" já existe";
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
				await sql.query("update presenca set data = ?, id_aluno = ?, id_disciplina = ? where id_disciplina = " + p.id_disciplina, [p.data,p.id_aluno,p.id_disciplina]);
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
