const {request,response} = require ('express');



const GET_Personas = (req=request,res=response)=>{
   res.send('Hola desde GET personas')
};

const POST_Personas=(req=request,res=response)=>{

   const {name,edad}= req.body;

   res.json({
      msg: "post API - personas",
      name
   });
}

const PUT_Personas=(req=request,res=response)=>{
   const id= req.params.id;

   res.json({
      msg: "put API - personas",
      id,
   });
}
const DELETE_Personas=(req=request,res=response)=>{
   res.send('Hola desde DELETE personas')
}


module.exports = {
   GET_Personas,
   POST_Personas,
   PUT_Personas,
   DELETE_Personas
}