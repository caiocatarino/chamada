"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        static cookie(req, res = null, admin = false) {
            return __awaiter(this, void 0, void 0, function* () {
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
                        yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                            let rows = yield sql.query("select id, login, nome, tipo, token from usuario where id = " + id);
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
                        }));
                    }
                    if (admin && usuario && usuario.tipo !== Usuario.TipoAdmin)
                        usuario = null;
                    if (!usuario && res) {
                        res.statusCode = 403;
                        res.json("Não permitido");
                    }
                    return usuario;
                }
            });
        }
        static gerarTokenCookie(id) {
            let idStr = "0000000" + (id ^ Usuario.HashId).toString(16);
            let idEventoLogadoStr = "00000000";
            let token = crypto_1.randomBytes(16).toString("hex");
            let cookieStr = idStr.substring(idStr.length - 8) + idEventoLogadoStr.substring(idEventoLogadoStr.length - 8) + token;
            return [token, cookieStr];
        }
        static efetuarLogin(login, senha, res) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!login || !senha)
                    return ["Usuário ou senha inválidos", null];
                let r = null;
                let u = null;
                yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                    login = login.trim().toUpperCase();
                    let rows = yield sql.query("select id, nome, tipo, senha from usuario where login = ?", [login]);
                    let row;
                    let ok;
                    if (!rows || !rows.length || !(row = rows[0]) || !(ok = yield GeradorHash.validarSenha(senha, row.senha))) {
                        r = "Usuário ou senha inválidos";
                        return;
                    }
                    let [token, cookieStr] = Usuario.gerarTokenCookie(row.id);
                    yield sql.query("update usuario set token = ? where id = " + row.id, [token]);
                    u = new Usuario();
                    u.id = row.id;
                    u.login = login;
                    u.nome = row.nome;
                    u.tipo = row.tipo;
                    u.cookieStr = cookieStr;
                    u.admin = (u.tipo === Usuario.TipoAdmin);
                    Usuario.cacheUsuarioLogados.set(row.id, u);
                    res.cookie("usuario", cookieStr, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, path: "/", secure: false });
                }));
                return [r, u];
            });
        }
        efetuarLogout(res) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                    yield sql.query("update usuario set token = null where id = " + this.id);
                    Usuario.cacheUsuarioLogados.del(this.id);
                    res.cookie("usuario", "", { expires: new Date(0), httpOnly: true, path: "/", secure: false });
                }));
            });
        }
        alterarPerfil(res, nome, senhaAtual, novaSenha) {
            return __awaiter(this, void 0, void 0, function* () {
                nome = (nome || "").trim().toUpperCase();
                if (nome.length < 3 || nome.length > 100)
                    return "Nome inválido";
                if (!!senhaAtual !== !!novaSenha || (novaSenha && novaSenha.length > 20))
                    return "Senha inválida";
                let r = null;
                yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                    if (senhaAtual) {
                        let hash = yield sql.scalar("select senha from usuario where id = " + this.id);
                        if (!(yield GeradorHash.validarSenha(senhaAtual, hash))) {
                            r = "Senha atual não confere";
                            return;
                        }
                        hash = yield GeradorHash.criarHash(novaSenha);
                        let [token, cookieStr] = Usuario.gerarTokenCookie(this.id);
                        yield sql.query("update usuario set nome = ?, senha = ?, token = ? where id = " + this.id, [nome, hash, token]);
                        this.nome = nome;
                        this.cookieStr = cookieStr;
                        res.cookie("usuario", cookieStr, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, path: "/", secure: false });
                    }
                    else {
                        yield sql.query("update usuario set nome = ? where id = " + this.id, [nome]);
                        this.nome = nome;
                    }
                }));
                return r;
            });
        }
        static validar(u) {
            u.nome = (u.nome || "").trim().toUpperCase();
            if (u.nome.length < 3 || u.nome.length > 100)
                return "Nome inválido";
            if (u.tipo !== Usuario.TipoAdmin && u.tipo !== Usuario.TipoComum)
                return "Tipo inválido";
            return null;
        }
        static listar() {
            return __awaiter(this, void 0, void 0, function* () {
                let lista = null;
                yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                    lista = (yield sql.query("select id, login, nome, case tipo when 0 then 'ADMIN' else 'COMUM' end tipo from usuario order by login asc"));
                }));
                return (lista || []);
            });
        }
        static obter(id) {
            return __awaiter(this, void 0, void 0, function* () {
                let lista = null;
                yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                    lista = (yield sql.query("select id, login, nome, tipo from usuario where id = " + id));
                }));
                return ((lista && lista[0]) || null);
            });
        }
        static criar(u) {
            return __awaiter(this, void 0, void 0, function* () {
                let res;
                if ((res = Usuario.validar(u)))
                    return res;
                u.login = (u.login || "").trim().toUpperCase();
                if (u.login.length < 3 || u.login.length > 50)
                    return "Login inválido";
                yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield sql.query("insert into usuario (login, nome, tipo, senha) values (?, ?, ?, '" + Usuario.HashSenhaPadrao + "')", [u.login, u.nome, u.tipo]);
                    }
                    catch (e) {
                        if (e.code && e.code === "ER_DUP_ENTRY")
                            res = "O login \"" + u.login + "\" já está em uso";
                        else
                            throw e;
                    }
                }));
                return res;
            });
        }
        static alterar(u) {
            return __awaiter(this, void 0, void 0, function* () {
                let res;
                if ((res = Usuario.validar(u)))
                    return res;
                yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                    yield sql.query("update usuario set nome = ?, tipo = ? where id = " + u.id, [u.nome, u.tipo]);
                    res = sql.linhasAfetadas.toString();
                    if (res)
                        Usuario.cacheUsuarioLogados.del(u.id);
                }));
                return res;
            });
        }
        static excluir(id) {
            return __awaiter(this, void 0, void 0, function* () {
                let res = null;
                yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                    yield sql.query("delete from usuario where id = " + id);
                    res = sql.linhasAfetadas.toString();
                    if (res)
                        Usuario.cacheUsuarioLogados.del(id);
                }));
                return res;
            });
        }
        static redefinirSenha(id) {
            return __awaiter(this, void 0, void 0, function* () {
                let res = null;
                yield Sql.conectar((sql) => __awaiter(this, void 0, void 0, function* () {
                    yield sql.query("update usuario set token = null, senha = ? where id = ?", [Usuario.HashSenhaPadrao, id]);
                    res = sql.linhasAfetadas.toString();
                    if (res)
                        Usuario.cacheUsuarioLogados.del(id);
                }));
                return res;
            });
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