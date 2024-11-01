import { autenticar, gerarToken } from '../utils/jwt.js'; 
import * as db from '../repository/usuarioRepository.js';
import { Router } from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';

const endpoints = Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

endpoints.post('/entrar/', async (req, resp) => {
    try {
        let pessoa = req.body;
        let usuario = await db.validarUsuario(pessoa);

        if (usuario == null) {
            resp.send({ erro: "Email ou senha incorreto(s)" });
        } else {
            let token = gerarToken(usuario);
            resp.send({
                token,
                id: usuario.id,
                nome: usuario.nome,
                telefone: usuario.telefone,
                imagemPerfil: usuario.imagem_perfil 
            });
        }
    }
    catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

endpoints.get('/agendamentos', async (req, res) => {
    try {
        const agendamentos = await db.consultarServiçoCliente();

        if (agendamentos.length > 0) {
            res.status(200).send(agendamentos);
        } else {
            res.status(404).send({ message: 'Nenhum agendamento encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
});

endpoints.post('/cadastro/', async (req, resp) => {
    try {
        let pessoa = req.body;

        const usuarioExistente = await db.verificarUsuarioExistente(pessoa.email, pessoa.telefone);
        if (usuarioExistente.length > 0) {
            return resp.status(400).send({ erro: "Email ou telefone já cadastrados." });
        }

        let id = await db.cadastrarUsuario(pessoa);
        resp.send({ novoId: id });
    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

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
        resp.status(400).send({ erro: err.message });
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
                <p>Olá,</p>
                <p>Você solicitou a redefinição da sua senha. Use o código abaixo para prosseguir:</p>
                <h3>${codigo}</h3>
                <p>Se você não solicitou essa mudança, pode ignorar este email.</p>
                <hr style="border: 1px solid #6A0DAD;">
                <footer style="text-align: center; color: #777;">
                    <p>&copy; ${new Date().getFullYear()} Lene Cabeleleira. Todos os direitos reservados.</p>
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

endpoints.delete('/usuario/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await db.deletarUsuario(id);

        if (resultado > 0) {
            res.status(200).send({ message: 'Usuário deletado com sucesso' });
        } else {
            res.status(404).send({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
});

endpoints.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).send('O campo nome é obrigatório');
    }

    try {
        const resultado = await db.AlterarNome(id, { nome });

        if (resultado > 0) {
            res.status(200).send({ message: 'Nome alterado com sucesso' });
        } else {
            res.status(404).send({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Endpoint para upload de imagem de perfil
endpoints.post('/usuario/:id/upload-imagem', upload.single('imagem'), async (req, resp) => {
    try {
        const { id } = req.params;
        const imagemPerfil = req.file ? req.file.path : null;

        if (!imagemPerfil) {
            return resp.status(400).send({ erro: 'Nenhuma imagem foi carregada.' });
        }

        await db.atualizarImagemPerfil(id, imagemPerfil);
        resp.send({ sucesso: true, mensagem: 'Imagem de perfil atualizada com sucesso!', imagem: imagemPerfil });
    } catch (err) {
        resp.status(500).send({ erro: 'Erro ao atualizar imagem de perfil.' });
    }
});


export default endpoints;
