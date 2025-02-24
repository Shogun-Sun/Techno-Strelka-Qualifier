const checkUnSession = async(req, res, next) => {
    if(!req.session.user){
        return res.status(401).json({message: 'Извините, вы не авторизованы'});
    };
    next();
};

const checkSession = async(req, res, next) => {
    if(req.session.user){
        return res.status(404).json({message: "Извините, вы уже авторизованы"});
    };
    next();
};

module.exports ={ checkSession, checkUnSession };