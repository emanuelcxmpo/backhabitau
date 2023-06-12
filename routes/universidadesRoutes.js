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
    let universidad = req.body;

    query = "INSERT INTO universidades(name) VALUES (?)";

    connection.query(query, [universidad.name], (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Universidad agregada" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.get("/get", auth.authenticationToken, (req, res) => {
  query = "SELECT * FROM universidades";
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
    let universidad = req.body;
    var query = "UPDATE universidades SET name=? WHERE id=?";
    connection.query(
      query,
      [universidad.property, universidad.id],
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
