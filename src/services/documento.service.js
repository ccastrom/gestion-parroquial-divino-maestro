const {Documento}=require('../models/documento.model');




const crearDocumento = async (documentoDatos) => {

    const {tipo_documento, estado_documento,fecha_entrega}=documentoDatos.documento

    console.log(tipo_documento);
    const documento = await Documento.create({
       tipo_documento,
       estado_documento,
       fecha_entrega

    });
    return documento;
};


const obtenerDocumentoParticipacion= async(id)=>{
   
}



module.exports={
    crearDocumento
}