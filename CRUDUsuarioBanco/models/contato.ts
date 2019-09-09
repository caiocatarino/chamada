import Sql = require("../infra/sql");

export = class Contato {
	public id: number;
	public nome: string;
	public endereco: string;
	public email: string;
	public peso: number;

	private static validar(c: Contato): string {
		c.nome = (c.nome || "").trim().toUpperCase();
		if (c.nome.length < 3 || c.nome.length > 200)
			return "Nome inválido";
		c.endereco = (c.endereco || "").trim().toUpperCase();
		if (c.endereco.length < 3 || c.endereco.length > 200)
			return "Endereço inválido";	
		c.email = (c.email || "").trim().toUpperCase();
		if (c.email.length < 3 || c.email.length > 200)
				return "Email inválido";
		if (c.peso <= 0)
			return "Peso inválido!";
		return null;
	}

	public static async listar(): Promise<Contato[]> {
		let lista: Contato[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select id, nome, endereco, email, peso from contato order by nome asc") as Contato[];
		});

		return (lista || []);
	}

	public static async obter(id: number): Promise<Contato> {
		let lista: Contato[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = await sql.query("select id, nome, endereco, email, peso from contato where id = ?",[id]) as Contato[];
		});

		if (lista && lista[0]) {
			return lista[0];
		}else {
			return null;
		}

		//return ((lista && lista[0]) || null);
	}

	public static async criar(c: Contato): Promise<string> {
		let res: string;
		if ((res = Contato.validar(c)))
			return res;

		await Sql.conectar(async (sql: Sql) => {
				await sql.query("insert into contato (nome,endereco,email,peso) values (?,?,?,?)", [c.nome,c.endereco,c.email,c.peso]);
		});

		
	}

	public static async alterar(c: Contato): Promise<string> {
		let res: string;
		if ((res = Contato.validar(c)))
			return res;

		await Sql.conectar(async (sql: Sql) => {	
				await sql.query("update contato set nome = ?, endereco = ?, email = ?, peso = ? where id = ?", [c.nome,c.endereco,c.email,c.peso,c.id]);
				res = sql.linhasAfetadas.toString();
		});

		
	}

	public static async excluir(id: number): Promise<string> {
		let res: string = null;

		await Sql.conectar(async (sql: Sql) => {
			await sql.query("delete from contato where id = " + id);
			res = sql.linhasAfetadas.toString();
		});

		return res;
	}
}
