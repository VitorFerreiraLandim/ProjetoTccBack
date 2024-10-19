import con from "./connection.js";

export async function agendarServiçoCliente(agenda) {
    const comando = `
        INSERT INTO agendamentos_cliente (cliente_id, trabalho, valor, dia, hora) VALUES (?, ?, ?, ?, ?)
    `
    let resposta = await con.query(comando, [agenda.cliente_id,agenda.trabalho,agenda.valor, agenda.dia,agenda.hora])
    let info = resposta[0]

    return info.insertId;
}

export async function deletarServicoCliente(id){
    const comando=`
        delete  from agendamentos_cliente where id = ?

    `
    let resposta= await con.query(comando,[id])
    let info = resposta[0]

    return info.affectedRows    
}

export async function agendarServiçoAdm(agenda) {
    const comando= `
    INSERT INTO agendamentos_adm ( trabalho , valor ,dia ,hora ,cliente_nome , cliente_telefone  ) VALUES(?,?,?,?,?,?)
    `

    let resposta = await con.query(comando, [agenda.trabalho,agenda.valor,agenda.dia,agenda.hora,agenda.cliente_nome,agenda.cliente_telefone])
    let  info = resposta[0]

    return info.insertId
}

export default function deletartServicoAdm(id) {
    const comando = `
     delete  from agendamentos_adm where id = ?
    `
    let resposta = con.query(comando, [id])
    let info = resposta[0]

    return info.affectedRows
}
