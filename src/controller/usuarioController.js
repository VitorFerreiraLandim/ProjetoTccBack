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

        const usuarioExistente = await db.verificarUsuarioExistente(pessoa.email, pessoa.telefone);
        if (usuarioExistente.length > 0) {
            return resp.status(400).send({
                erro: "Email ou telefone já cadastrados."
            });
        }

        resp.send({
            novoId: id
        })
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

endpoints.post('/verificar-email', async (req, res) => {
    const { email } = req.body;
    const apiKey = '5fae6172b8d6f7789a678d33f224a42667e52aaa'; 
    const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao verificar e-mail:', error);
        res.status(500).json({ error: 'Erro ao verificar e-mail' });
    }
});

export default endpoints;