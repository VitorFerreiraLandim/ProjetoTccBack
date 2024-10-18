import {autenticar, gerarToken} from '../utils/jwt.js';
import * as db from '../repository/usuarioRepository.js';
import { Router } from 'express';
import nodemailer from 'nodemailer'
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

        

        const usuarioExistente = await db.verificarUsuarioExistente(pessoa.email, pessoa.telefone);
        if (usuarioExistente.length > 0) {
            return resp.status(400).send({
                erro: "Email ou telefone já cadastrados."
            });
        }

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




endpoints.post('/verificar-email2', async (req, resp) => {
    try {
        const { email } = req.body;

        
        const existe = await db.verificarEmail(email);

        if (existe) {
            const codigo = Math.floor(100000 + Math.random() * 900000); 
            
            await enviarEmail(email, codigo);
            
            resp.send({ existe: true, codigo }); 
        } else {
            resp.send({ existe: false });
        }
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        });
    }
});


async function enviarEmail(email, codigo) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'vitorferreiralandim14@gmail.com', 
            pass: 'z a b g e z j v p t c s a l k j' 
        }
    });

    const mailOptions = {
        from: 'vitorferreiralandim14@gmail.com',
        to: email,
        subject: 'Código de Redefinição de Senha',
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; border-radius: 5px;">
            <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #6A0DAD;">Redefinição de Senha</h2>
                <p style="color: #333;">Olá,</p>
                <p style="color: #333;">Você solicitou a redefinição da sua senha. Use o código abaixo para prosseguir:</p>
                <h3 style="color: #6A0DAD; font-size: 24px;">${codigo}</h3>
                <p style="color: #333;">Se você não solicitou essa mudança, pode ignorar este email.</p>
                <hr style="border: 1px solid #6A0DAD;">
                <footer style="text-align: center; color: #777;">
                    <p>&copy; ${new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.</p>
                </footer>
            </div>
        </div>
    `
    };

    await transporter.sendMail(mailOptions);
}

endpoints.post('/redefinir-senha', async (req, resp) => {
    try {
        const { novaSenha, email } = req.body;

        const resultado = await db.redefinirSenha(novaSenha, email);

        if (resultado) {
            resp.send({ success: true, message: 'Senha redefinida com sucesso!' });
        } else {
            resp.status(400).send({ success: false, message: 'Erro ao redefinir a senha. Verifique o e-mail.' });
        }
    } catch (err) {
        console.error('Erro ao redefinir a senha:', err);
        resp.status(500).send({ error: err.message });
    }
});




export default endpoints;