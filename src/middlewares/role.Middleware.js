module.exports = (role) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ msg: "Access denied. No role found." });
    }

    const allowedRoles = Array.isArray(role) ? role : [role];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        msg: "Access denied. Insufficient permissions.",
        required: allowedRoles,
        current: req.user.role,
      });
    }

    next();
  };
};

