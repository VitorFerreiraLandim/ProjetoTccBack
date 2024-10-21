import * as db from '../repository/agendamentosRepository.js';
import { Router } from 'express';
const endpoints = Router();

endpoints.post('/agendamentos', async (req, res) => {
    try {
        const agenda = req.body;
        const agendamentoCliente = await db.agendarServiçoCliente(agenda);

        if (agendamentoCliente) {
            res.status(201).send({ 
                message: 'Agendamento agendado com sucesso', 
                agendamento: { 
                    id: agendamentoCliente, 
                    ...agenda 
                } 
            });
        } else {
            res.status(400).send('Erro ao agendar');
        }
    } catch (error) {
        console.error(error); 
        res.status(500).send('Erro interno do servidor');
    }
});

endpoints.get('/agendamento', async (req, resp) => {
    try {
        const clienteId = req.query.cliente_id; // Obtendo o ID do cliente da query
        const agendamentos = await db.consultarServiçoCliente(clienteId);
        resp.send(agendamentos);
    } catch (error) {
        console.error('Erro ao obter agendamentos:', error);
        resp.status(500).send('Erro interno do servidor');
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