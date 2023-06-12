require("dotenv").config();

function checkRole(req, res, next) {
  if (res.locals.role == 2 || res.locals.role == 3) {
    return res.sendStatus(401);
  } else {
    next();
  }
}

module.exports = { checkRole: checkRole };
