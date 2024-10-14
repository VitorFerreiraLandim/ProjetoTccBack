import con from './connection.js'

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