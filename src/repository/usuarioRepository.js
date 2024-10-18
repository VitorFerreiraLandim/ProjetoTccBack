import con from './connection.js'
import bcrypt from 'bcrypt';

export async function cadastrarUsuario(pessoa) {
    const comando = `
        insert into tb_usuario (nome,telefone,email,senha)
            values(?,?,?,?)
    `
    
    let resposta = await con.query(comando, [pessoa.nome, pessoa.telefone, pessoa.email, pessoa.senha])
    let info = resposta[0]

    return info.insertId;
}

export async function validarUsuario(pessoa){
    const comando = `
        select 
            id_usuario id,
            email email
        from tb_usuario 
        where 
            email = ?
            and senha = ?
    `;

    let registros = await con.query(comando, [pessoa.email, pessoa.senha])
    return registros[0][0];
}

export async function verificarUsuarioExistente(email, telefone) {
    const comando = `
        SELECT * FROM tb_usuario 
        WHERE email = ? OR telefone = ?
    `;
    let registros = await con.query(comando, [email, telefone]);
    return registros[0]; 
}

export async function verificarEmail(email) {
    const comando = `
        SELECT email FROM tb_usuario 
        WHERE email = ?
    `;
    let registros = await con.query(comando, [email]);
    return registros[0].length > 0;
}

export async function redefinirSenha( novaSenha, email) {
   
    
    const comando = `
        UPDATE tb_usuario 
        SET senha = ? 
        WHERE email = ?
    `;
    
    const resultado = await con.query(comando, [novaSenha, email]);
    console.log(resultado);

    return resultado.affectedRows > 0;
}



