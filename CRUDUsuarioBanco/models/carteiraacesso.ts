import Sql = require("../infra/sql");
import converteData = require("../utils/converteData");


export = class CarteiraAcesso {
	public id_carteiraAcesso: number;
	public validade_carteiraAcesso: string;
	public nfc_carteiraAcesso: string;

	public id_aluno:number;

	private static validar(c: CarteiraAcesso): string {
		c.validade_carteiraAcesso = converteData(c.validade_carteiraAcesso);
			if (!c.validade_carteiraAcesso)
				return "Data inválida!"; 
		return null;
	}

	public static async listar(): Promise<CarteiraAcesso[]> {
		let lista: CarteiraAcesso[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select date_format(c.validade_carteiraAcesso,'%d/%m/%Y' ) validade_carteiraAcesso,c.nfc_carteiraAcesso, a.nome_aluno, a.id_aluno, c.id_carteiraAcesso from carteiraAcesso c, aluno a where c.id_aluno = a.id_aluno") as CarteiraAcesso[];
		});

		return (lista || []);
	}

	public static async obter(id_carteiraAcesso: number): Promise<CarteiraAcesso> {
		let lista: CarteiraAcesso[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select date_format(c.validade_carteiraAcesso,'%d/%m/%Y' ) validade_carteiraAcesso,c.nfc_carteiraAcesso, a.id_aluno, a.nome_aluno, c.id_carteiraAcesso from carteiraAcesso c, aluno a where c.id_aluno = a.id_aluno and id_carteiraAcesso =   " + id_carteiraAcesso) as CarteiraAcesso[];
		});

		return ((lista && lista[0]) || null);
	}

	public static async criar(c: CarteiraAcesso): Promise<string> {
		let res: string;
		if ((res = CarteiraAcesso.validar(c)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("insert into carteiraAcesso (validade_carteiraAcesso,id_aluno,nfc_carteiraAcesso) values (?,?,?)", [c.validade_carteiraAcesso,c.id_aluno,c.nfc_carteiraAcesso]);
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = "A Carteira de Acesso \"" + c.id_carteiraAcesso + "\" já existe";
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
				await sql.query("update carteiraAcesso set validade_carteiraAcesso = ?, id_aluno = ? where id_carteiraAcesso = " + c.id_carteiraAcesso, [c.validade_carteiraAcesso,c.id_aluno]);
				res = sql.linhasAfetadas.toString();
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					res = "A Carteira de Acesso \"" + c.id_carteiraAcesso + "\" já existe";
				else
					throw e;
			}
		});

		return res;
	}

	public static async excluir(id_carteiraAcesso: number): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
			await sql.query("delete from carteiraAcesso where id_carteiraAcesso = " + id_carteiraAcesso);
			res = sql.linhasAfetadas.toString();
		});

		return res;
	}

	public static async marcar(nfc: string): Promise<boolean> {
		let res: boolean = false;

		await Sql.conectar(async (sql: Sql) => {
			let lista = await sql.query("select a.id_aluno, d.id_disciplina from carteiraAcesso c inner join aluno a on a.id_aluno = c.id_aluno inner join disciplina d on d.id_curso = a.id_curso where c.nfc_carteiraAcesso = ? and d.presenca_aberta = 1", [nfc]);
			if (!lista || !lista.length) {
				return;
			}
			try {
				await sql.query("insert into presenca(data, id_aluno, id_disciplina) values (curdate(), ?, ?)", [lista[0].id_aluno, lista[0].id_disciplina]);
				res = true;
			} catch (ex) {
			}
		});

		return res;
	}
}
