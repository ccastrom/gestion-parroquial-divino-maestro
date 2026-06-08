

const ESTADOS_TRAMITE = {
    Tramite_Iniciado: 'Iniciado',
    Reunion_Pre_Bautizo_Creada: 'Reunión Pre bautizo creada',
    Reunion_Pre_Bautizo_Asignada: 'Reunión Pre bautizo asignada',
    Reunion_Pre_Bautizo_Completada: 'Reunión Pre bautizo completada',
    Evento_Bautizo_Agendado: 'Evento bautizo agendado',
    Bautizo_Finalizado_Con_Éxito: 'Bautizo finalizado con éxito',
    Bautizo_Derivado_A_Otra_Parroquia: 'Bautizo derivado a otra parroquia',
    Bautizo_Reabierto: 'Bautizo reabierto',
    Bautizo_Cancelado: 'Bautizo cancelado',
};

const ESTADOS_REUNION = {
    Reunion_Pre_Bautizo_Creada: ESTADOS_TRAMITE.Reunion_Pre_Bautizo_Creada,
    Reunion_Pre_Bautizo_Asignada: ESTADOS_TRAMITE.Reunion_Pre_Bautizo_Asignada,
    Reunion_Pre_Bautizo_Completada: ESTADOS_TRAMITE.Reunion_Pre_Bautizo_Completada,
    Reunion_Pre_Bautizo_Cancelada: 'Reunión Pre bautizo cancelada',
};

const ESTADOS_DOCUMENTO = {
    Documento_Pendiente: 'Documento Pendiente',
    Documento_Entregado: 'Documento Entregado',
    Documento_No_Entregado: 'Documento no entregado',
    Documento_Proximo_A_Entregar: 'Documento próximo a entregar',
};

const ESTADOS_VALIDOS = { ...ESTADOS_TRAMITE, ...ESTADOS_REUNION, ...ESTADOS_DOCUMENTO };

const validarEstadoTramite = (estado) => {
    if (!Object.values(ESTADOS_TRAMITE).includes(estado)) {
        throw new Error(`Estado de trámite no válido. Estados permitidos: ${Object.values(ESTADOS_TRAMITE).join(', ')}`);
    }
};

const validarEstadoReunion = (estado) => {
    if (!Object.values(ESTADOS_REUNION).includes(estado)) {
        throw new Error(`Estado de reunión no válido. Estados permitidos: ${Object.values(ESTADOS_REUNION).join(', ')}`);
    }
};

const validarEstadoDocumento = (estado) => {
    if (!Object.values(ESTADOS_DOCUMENTO).includes(estado)) {
        throw new Error(`Estado de documento no válido. Estados permitidos: ${Object.values(ESTADOS_DOCUMENTO).join(', ')}`);
    }
};

module.exports = {
    ESTADOS_VALIDOS,
    ESTADOS_TRAMITE,
    ESTADOS_REUNION,
    ESTADOS_DOCUMENTO,
    validarEstadoTramite,
    validarEstadoReunion,
    validarEstadoDocumento,
};
