const ROLES_VALIDOS = 

{Bautizado:'Bautizado',
    Padre:'Padre',
    Madre:'Madre',
    Tutor_Legal:'Tutor Legal',
    Padrino:'Padrino',
    Madrina:'Madrina',
    Celebrante:'Celebrante',
    Testigo:'Testigo',
    Catequista:'Catequista'
};

const  validateRol=(rol)=>{
     if(!Object.values(ROLES_VALIDOS).includes(rol)){
        throw new Error(`Rol no válido. Roles permitidos: ${Object.values(ROLES_VALIDOS).join(', ')}`);
    }
}
module.exports = { ROLES_VALIDOS, validateRol };