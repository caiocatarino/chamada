import Sql = require("../infra/sql");

export = class Disciplina {
	public id_disciplina: number;
	public nome_disciplina: string;
	public carga_horaria_disciplina: number;
	public semestre_materia: number;
	public ano_disciplina: string;
	public presenca_aberta: boolean;

	public id_professor: number;
	public id_curso: number;

	private static validar(d: Disciplina): string {
		d.nome_disciplina = (d.nome_disciplina || "").trim().toUpperCase();
		if (d.nome_disciplina.length < 3 || d.nome_disciplina.length > 200)
			return "Nome inválido";
		if (d.carga_horaria_disciplina <= 0)
			return "Carga horária inválido!";
		if (d.semestre_materia <= 0)
			return "Semestre inválido!";
		
		return null;
	}

	public static async listar(): Promise<Disciplina[]> {
		let lista: Disciplina[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select d.id_disciplina, d.nome_disciplina, d.carga_horaria_disciplina, d.semestre_materia, "+ 
			+" d.ano_disciplina, d.presenca_aberta, p.id_professor, p.nome_professor, "+
			+" c.id_curso, c.nome_curso from disciplina d, professor p, curso c where d.id_professor = p.id_professor "+
			+" and d.id_curso = c.id_curso order by d.nome_disciplina asc ") as Disciplina[];
		});

		return (lista || []);
	}

	public static async obter(id_disciplina: number): Promise<Disciplina> {
		let lista: Disciplina[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select d.id_disciplina, d.nome_disciplina, d.carga_horaria_disciplina, d.semestre_materia, "+ 
			+" d.ano_disciplina, d.presenca_aberta, p.id_professor, p.nome_professor, "+
			+" c.id_curso, c.nome_curso from disciplina d, professor p, curso c where d.id_professor = p.id_professor "+
			+" and d.id_curso = c.id_curso and id_disciplina = ?  ",[id_disciplina]) as Disciplina[];
		});

		if (lista && lista[0]) {
			return lista[0];
		}else {
			return null;
		}

		//return ((lista && lista[0]) || null);
	}

	public static async criar(d: Disciplina): Promise<string> {
		let res: string;
		if ((res = Disciplina.validar(d)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
				await sql.query("insert into disciplina (nome_disciplina,carga_horaria_disciplina,semestre_materia,ano_disciplina, presenca_aberta, id_professor,id_curso) values (?,?,?,?,?,?,?)", [d.nome_disciplina,d.carga_horaria_disciplina,d.semestre_materia,d.ano_disciplina,d.presenca_aberta,d.id_professor,d.id_curso]);
		});

		
	}

	public static async alterar(d: Disciplina): Promise<string> {
		let res: string;
		if ((res = Disciplina.validar(d)))
			return res;

		await Sql.conectar(async (sql: Sql) => {	
				await sql.query("update disciplina set nome_disciplina = ?, carga_horaria_disciplina = ?, semestre_materia = ?, ano_disciplina = ?, presenca_aberta = ?, id_professor = ?, id_curso = ? where id_disciplina = ?", [d.nome_disciplina,d.presenca_aberta,d.semestre_materia,d.ano_disciplina,d.presenca_aberta,d.id_professor,d.id_curso]);
				res = sql.linhasAfetadas.toString();
		});

		
	}

	public static async excluir(id_disciplina: number): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
			await sql.query("delete from disciplina where id_disciplina = " + id_disciplina);
			res = sql.linhasAfetadas.toString();
		});

		return res;
	}
}
