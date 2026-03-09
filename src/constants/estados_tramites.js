
const ESTADOS_VALIDOS={
    Tramite_Iniciad:'Tramite iniciado',
    Reunion_Pre_Bautizo_Asignada:'Reunion Pre bautizo asignada',
    Reunion_Pre_Bautizo_Completada:'Reunion Pre bautizo completada',
    Evento_Bautizo_Agendado:'Evento bautizo agendado',
    Bautizo_Finalizado_Con_Éxito:'Bautizo finalizado con éxito',
    Bautizo_Derivado_A_Otra_Parroquia:'Bautizo derivado a otra parroquia',
    Bautizo_Reabierto:'Bautizo reabierto',
    Bautizo_Cancelado:'Bautizo cancelado'
};

const  validarEstado=(estado)=>{
     if(!Object.values(ESTADOS_VALIDOS).includes(estado)){
        throw new Error(`Estado no válido. Estados permitidos: ${Object.values(ESTADOS_VALIDOS).join(', ')}`);
    }
}

module.exports = { ESTADOS_VALIDOS,validarEstado };