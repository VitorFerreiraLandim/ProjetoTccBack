import usuarioController from './controller/usuarioController.js'
import agendamentoController from './controller/agendamentosController.js'


export default function adicionarRotas(servidor){
    servidor.use(usuarioController),
    servidor.use(agendamentoController)
}