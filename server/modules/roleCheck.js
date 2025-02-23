const roleCheck = (requiredRoles) => {
    return (req, res, next) => {
        if(!req.session.user){
            return res.status(401).json({message: "Пожалуйста, авторизуйтесь"});
        };

        if(!requiredRoles.includes(req.session.user.role)){
            return res.status(403).json({message: "В доступе отказано"});
        };

        next();
    };
}

module.exports = roleCheck;