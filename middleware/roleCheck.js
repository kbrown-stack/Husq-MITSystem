
const checkRoles = (allowedRoles = []) => {
    return (req,res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access restricted. Insuffient permision'
            });
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
            return res.status(401).json({
                success:false,
                message: 'Access Denied! Insuccficient Access.'
            });
        }
        next();
    };
};

module.exports = checkRoles;