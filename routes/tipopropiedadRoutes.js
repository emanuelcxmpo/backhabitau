const express = require("express");
const connection = require("../connection.js");
const router = express.Router();

var auth = require("../services/authentication.js");
var checkRole = require("../services/checkRole.js");

router.post(
  "/add",
  auth.authenticationToken,
  checkRole.checkRole,
  (req, res) => {
    let tipopropiedad = req.body;

    query = "INSERT INTO tipo_propiedad(property) VALUES (?)";

    connection.query(query, [tipopropiedad.property], (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Tipo de propiedad agregado" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.get("/getProperty", auth.authenticationToken, (req, res) => {
  query = "SELECT * FROM tipo_propiedad";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch(
  "/update",
  auth.authenticationToken,
  checkRole.checkRole,
  (req, res) => {
    let tipopropiedad = req.body;
    var query = "UPDATE tipo_propiedad SET property=? WHERE id=?";
    connection.query(
      query,
      [tipopropiedad.property, tipopropiedad.id],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res
              .status(500)
              .json({ message: "Tipo de propiedad no encontrado" });
          }
          return res
            .status(200)
            .json({ message: "Tipo de propiedad actualizado" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);

module.exports = router;
