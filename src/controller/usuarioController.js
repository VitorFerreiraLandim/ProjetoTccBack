import {autenticar, gerarToken} from '../utils/jwt.js';
import * as db from '../repository/usuarioRepository.js';
import { Router } from 'express';
const endpoints = Router();

endpoints.post('/entrar/', async (req, resp) => {
    try {
        let pessoa = req.body;

        let usuario = await db.validarUsuario(pessoa);

        if (usuario == null) {
            resp.send({ erro: "Email ou senha incorreto(s)" })
        } else {
            let token = gerarToken(usuario);
            resp.send({
                "token": token
            })
        }
    }
    catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

endpoints.post('/cadastro/',  async (req,resp) => {
    try {
        let pessoa = req.body;

        let id = await db.cadastrarUsuario(pessoa);

        resp.send({
            novoId: id
        })
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})


export default endpoints;