const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      req.flash('error', 'Anda tidak memiliki akses ke halaman ini');
      return res.redirect('/dashboard');
    }
    next();
  };
};

module.exports = { authorizeRole };
