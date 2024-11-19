exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.filterUserResults = (req, res, next) => {
  if (req.user.role !== "admin") req.query.user = req.user.id;
  next();
};
