import con from "./connection.js";

export async function agendarServiçoCliente(agenda) {
    const comando = `
        INSERT INTO agendamentos_cliente (cliente_id, trabalho, valor, dia, hora) VALUES (?, ?, ?, ?, ?)
    `;
    let resposta = await con.query(comando, [agenda.cliente_id, agenda.trabalho, agenda.valor, agenda.dia, agenda.hora]);
    let info = resposta[0];

    return info.insertId;
}

export async function consultarServiçoCliente(clienteId) {
    const comando = `
        SELECT id, cliente_id, trabalho, valor, dia, hora
        FROM agendamentos_cliente
        WHERE cliente_id = ?
    `;
    let resposta = await con.query(comando, [clienteId]);
    let registro = resposta[0];

    return registro;
}

export async function consultarHorariosOcupados(dia) {
    const comando = `
        SELECT hora FROM agendamentos_cliente WHERE dia = ?
    `;
    let resposta = await con.query(comando, [dia]);
    let registros = resposta[0];


    return registros.map(registro => registro.hora);
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

export async function deletartServicoAdm(id) {
    const comando = `
     delete  from agendamentos_adm where id = ?
    `
    let resposta = con.query(comando, [id])
    let info = resposta[0]

    return info.affectedRows
}

export async function consultarServicoAdm(id) {
    const comando = `
    SELECT * FROM agendamentos_adm WHERE id = ?
    `;
    
    let resposta = await con.query(comando, [id]);
    
    if (resposta.length > 0) {
        return resposta[0]; 
    } else {
        throw new Error('Agendamento não encontrado');
    }
}


export async function verificarHorarioOcupado(dia, hora) {
    const existingAppointment = await con.collection('agendamentos').findOne({ dia, hora });
    return existingAppointment !== null;
}
