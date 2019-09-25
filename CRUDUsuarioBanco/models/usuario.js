"use strict";
var _a;
const crypto_1 = require("crypto");
// https://www.npmjs.com/package/lru-cache
const lru = require("lru-cache");
const Sql = require("../infra/sql");
const GeradorHash = require("../utils/geradorHash");
module.exports = (_a = class Usuario {
        static removerDoCache(id) {
            Usuario.cacheUsuarioLogados.del(id);
        }
        // Parei de usar Usuario.pegarDoCookie como middleware, porque existem muitas requests
        // que não precisam validar o usuário logado, e agora, é assíncrono...
        // http://expressjs.com/pt-br/guide/writing-middleware.html
        //public static pegarDoCookie(req: express.Request, res: express.Response, next: Function): void {
        static async cookie(req, res = null, admin = false) {
            let cookieStr = req.cookies["usuario"];
            if (!cookieStr || cookieStr.length !== 48) {
                if (res) {
                    res.statusCode = 403;
                    res.json("Não permitido");
                }
                return null;
            }
            else {
                let id = parseInt(cookieStr.substr(0, 8), 16) ^ Usuario.HashId;
                let usuario = Usuario.cacheUsuarioLogados.get(id);
                if (usuario) {
                    if (usuario.cookieStr !== cookieStr)
                        usuario = null;
                }
                else {
                    usuario = null;
                    await Sql.conectar(async (sql) => {
                        let rows = await sql.query("select id, login, nome, tipo, token from usuario where id = " + id);
                        let row;
                        if (!rows || !rows.length || !(row = rows[0]))
                            return;
                        let token = cookieStr.substring(16);
                        if (!row.token ||
                            token !== row.token)
                            return;
                        let u = new Usuario();
                        u.id = id;
                        u.login = row.login;
                        u.nome = row.nome;
                        u.tipo = row.tipo;
                        u.cookieStr = cookieStr;
                        u.admin = (u.tipo === Usuario.TipoAdmin);
                        Usuario.cacheUsuarioLogados.set(id, u);
                        usuario = u;
                    });
                }
                if (admin && usuario && usuario.tipo !== Usuario.TipoAdmin)
                    usuario = null;
                if (!usuario && res) {
                    res.statusCode = 403;
                    res.json("Não permitido");
                }
                return usuario;
            }
        }
        static gerarTokenCookie(id) {
            let idStr = "0000000" + (id ^ Usuario.HashId).toString(16);
            let idEventoLogadoStr = "00000000";
            let token = crypto_1.randomBytes(16).toString("hex");
            let cookieStr = idStr.substring(idStr.length - 8) + idEventoLogadoStr.substring(idEventoLogadoStr.length - 8) + token;
            return [token, cookieStr];
        }
        static async efetuarLogin(login, senha, res) {
            if (!login || !senha)
                return ["Usuário ou senha inválidos", null];
            let r = null;
            let u = null;
            await Sql.conectar(async (sql) => {
                login = login.trim().toUpperCase();
                let rows = await sql.query("select id, nome, tipo, senha from usuario where login = ?", [login]);
                let row;
                let ok;
                if (!rows || !rows.length || !(row = rows[0]) || !(ok = await GeradorHash.validarSenha(senha, row.senha))) {
                    r = "Usuário ou senha inválidos";
                    return;
                }
                let [token, cookieStr] = Usuario.gerarTokenCookie(row.id);
                await sql.query("update usuario set token = ? where id = " + row.id, [token]);
                u = new Usuario();
                u.id = row.id;
                u.login = login;
                u.nome = row.nome;
                u.tipo = row.tipo;
                u.cookieStr = cookieStr;
                u.admin = (u.tipo === Usuario.TipoAdmin);
                Usuario.cacheUsuarioLogados.set(row.id, u);
                res.cookie("usuario", cookieStr, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, path: "/", secure: false });
            });
            return [r, u];
        }
        async efetuarLogout(res) {
            await Sql.conectar(async (sql) => {
                await sql.query("update usuario set token = null where id = " + this.id);
                Usuario.cacheUsuarioLogados.del(this.id);
                res.cookie("usuario", "", { expires: new Date(0), httpOnly: true, path: "/", secure: false });
            });
        }
        async alterarPerfil(res, nome, senhaAtual, novaSenha) {
            nome = (nome || "").trim().toUpperCase();
            if (nome.length < 3 || nome.length > 100)
                return "Nome inválido";
            if (!!senhaAtual !== !!novaSenha || (novaSenha && novaSenha.length > 20))
                return "Senha inválida";
            let r = null;
            await Sql.conectar(async (sql) => {
                if (senhaAtual) {
                    let hash = await sql.scalar("select senha from usuario where id = " + this.id);
                    if (!await GeradorHash.validarSenha(senhaAtual, hash)) {
                        r = "Senha atual não confere";
                        return;
                    }
                    hash = await GeradorHash.criarHash(novaSenha);
                    let [token, cookieStr] = Usuario.gerarTokenCookie(this.id);
                    await sql.query("update usuario set nome = ?, senha = ?, token = ? where id = " + this.id, [nome, hash, token]);
                    this.nome = nome;
                    this.cookieStr = cookieStr;
                    res.cookie("usuario", cookieStr, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, path: "/", secure: false });
                }
                else {
                    await sql.query("update usuario set nome = ? where id = " + this.id, [nome]);
                    this.nome = nome;
                }
            });
            return r;
        }
        static validar(u) {
            u.nome = (u.nome || "").trim().toUpperCase();
            if (u.nome.length < 3 || u.nome.length > 100)
                return "Nome inválido";
            if (u.tipo !== Usuario.TipoAdmin && u.tipo !== Usuario.TipoComum)
                return "Tipo inválido";
            return null;
        }
        static async listar() {
            let lista = null;
            await Sql.conectar(async (sql) => {
                lista = await sql.query("select id, login, nome, case tipo when 0 then 'ADMIN' else 'COMUM' end tipo from usuario order by login asc");
            });
            return (lista || []);
        }
        static async obter(id) {
            let lista = null;
            await Sql.conectar(async (sql) => {
                lista = await sql.query("select id, login, nome, tipo from usuario where id = " + id);
            });
            return ((lista && lista[0]) || null);
        }
        static async criar(u) {
            let res;
            if ((res = Usuario.validar(u)))
                return res;
            u.login = (u.login || "").trim().toUpperCase();
            if (u.login.length < 3 || u.login.length > 50)
                return "Login inválido";
            await Sql.conectar(async (sql) => {
                try {
                    await sql.query("insert into usuario (login, nome, tipo, senha) values (?, ?, ?, '" + Usuario.HashSenhaPadrao + "')", [u.login, u.nome, u.tipo]);
                }
                catch (e) {
                    if (e.code && e.code === "ER_DUP_ENTRY")
                        res = "O login \"" + u.login + "\" já está em uso";
                    else
                        throw e;
                }
            });
            return res;
        }
        static async alterar(u) {
            let res;
            if ((res = Usuario.validar(u)))
                return res;
            await Sql.conectar(async (sql) => {
                await sql.query("update usuario set nome = ?, tipo = ? where id = " + u.id, [u.nome, u.tipo]);
                res = sql.linhasAfetadas.toString();
                if (res)
                    Usuario.cacheUsuarioLogados.del(u.id);
            });
            return res;
        }
        static async excluir(id) {
            let res = null;
            await Sql.conectar(async (sql) => {
                await sql.query("delete from usuario where id = " + id);
                res = sql.linhasAfetadas.toString();
                if (res)
                    Usuario.cacheUsuarioLogados.del(id);
            });
            return res;
        }
        static async redefinirSenha(id) {
            let res = null;
            await Sql.conectar(async (sql) => {
                await sql.query("update usuario set token = null, senha = ? where id = ?", [Usuario.HashSenhaPadrao, id]);
                res = sql.linhasAfetadas.toString();
                if (res)
                    Usuario.cacheUsuarioLogados.del(id);
            });
            return res;
        }
    },
    _a.cacheUsuarioLogados = lru(100),
    // A senha padrão é 1234
    _a.HashSenhaPadrao = "peTcC99vkvvLqGQL7mdhGuJZIvL2iMEqvCNvZw3475PJ:JVyo1Pg2HyDyw9aSOd3gNPT30KdEyiUYCjs7RUzSoYGN",
    // Não utilizar números > 0x7FFFFFFF, pois os XOR resultarão em -1
    _a.HashId = 0x16e7fef4,
    _a.TipoAdmin = 0,
    _a.TipoComum = 1,
    _a);
//# sourceMappingURL=usuario.js.map