import * as db from '../repository/agendamentosRepository.js';
import { Router } from 'express';
const endpoints = Router();

endpoints.post('/agendamentos', async (req, res) => {
    try {
        const agenda = req.body;


        if (!agenda.cliente_id || !agenda.trabalho || !agenda.valor || !agenda.dia || !agenda.hora) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        const agendamentoCliente = await db.agendarServiçoCliente(agenda);

        if (agendamentoCliente) {
            res.status(201).send({ message: 'Agendamento agendado com sucesso', agendamento: agendamentoCliente });
        } else {
            res.status(400).send('Erro ao agendar');
        }
    } catch (error) {
        console.error(error); 
        res.status(500).send('Erro interno do servidor');
    }
});


endpoints.post('/agendamentos_adm', async(req,res) =>{
try {
    
    const agenda = req.body;
    const agendamento_adm= await  db.agendarServiçoAdm(agenda);
    if (agendamento_adm) {
        res.status(201).send({ message: 'Agendamento agendado com sucesso', agendamento: agendamento_adm });
    } else {
        res.status(400).send('Erro ao agendar');
    }
} catch (error) {
    console.error(error); 
    res.status(500).send('Erro interno do servidor');
}
})




export default endpoints;