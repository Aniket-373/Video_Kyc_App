module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.roleId)) {
            return res.status(403).json({
                message: "Access denied for this role",
            });
        }
        next();
    };
};
