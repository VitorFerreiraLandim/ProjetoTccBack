import usuarioController from './controller/usuarioController.js'

export default function adicionarRotas(servidor){
    servidor.use(usuarioController)
}