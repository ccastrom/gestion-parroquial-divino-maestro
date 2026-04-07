

const validateBody=(schema)=>{
    return (req,res,next)=>{
        const {value,error}=schema.validate(req.body);
        if(error){
            return res.status(400).json({error:error.details[0].message});
        }
        //console.log("ANTES:", req.body);
        //console.log("DESPUÉS:", value);

        req.body = value;
        next();
}
}

module.exports={validateBody}