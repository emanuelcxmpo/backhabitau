require("dotenv").config();
const express = require("express");
const connection = require("../connection.js");
const router = express.Router();

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

var auth = require("../services/authentication.js");
var checkRole = require("../services/checkRole.js");

router.post("/register", (req, res) => {
  let usuario = req.body;

  query =
    "SELECT first_name, last_name, phone, email, username, password, role FROM usuarios WHERE email=?";

  connection.query(query, [usuario.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "INSERT INTO usuarios(first_name, last_name, phone, email, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
        connection.query(
          query,
          [
            usuario.first_name,
            usuario.last_name,
            usuario.phone,
            usuario.email,
            usuario.username,
            usuario.password,
            usuario.role,
          ],
          (err, results) => {
            if (!err) {
              return res.status(200).json({ message: "Usuario registrado" });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res.status(500).json({ message: "El correo ya existe" });
      }
    } else {
      return res.status(500).json(err);
    }
  });

  query =
    "SELECT first_name, last_name, phone, email, username, password, role FROM usuarios WHERE username=?";

  connection.query(query, [usuario.username], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "INSERT INTO usuarios(first_name, last_name, phone, email, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
        connection.query(
          query,
          [
            usuario.first_name,
            usuario.last_name,
            usuario.phone,
            usuario.email,
            usuario.username,
            usuario.password,
            usuario.role,
          ],
          (err, results) => {
            if (!err) {
              return res.status(200).json({ message: "Usuario registrado" });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res.status(500).json({ message: "El usuario ya fue usado" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post("/login", (req, res) => {
  const usuario = req.body;

  query =
    "SELECT id, email, username, password, role FROM usuarios WHERE username=?";

  connection.query(query, [usuario.username], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != usuario.password) {
        return res
          .status(401)
          .json({ message: "Usuario o contraseña incorrectos" });
      } else if (results[0].password == usuario.password) {
        const response = {
          username: results[0].username,
          role: results[0].role,
        };
        const accessToken = jwt.sign(
          response,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "8h" }
        );
        return res
          .status(200)
          .json({
            accessToken: accessToken,
            username: results[0].username,
            role: results[0].role,
          });
      } else {
        return res
          .status(400)
          .json({
            message: "Ha ocurrido un error, por favor intenta de mas tarde",
          });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    username: process.env.EMAIL,
    pass: process.env.PASSWORD_EMAIL,
  },
});

router.post("/forgot", (req, res) => {
  const usuario = req.body;

  query = "SELECT email, password FROM usuarios WHERE email=?";

  connection.query(query, [usuario.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res
          .status(200)
          .json({
            message:
              "La contraseña fue enviada exitosamente a su correo electronico",
          });
      } else {
        var mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "Recuperación de contraseña",
          text: "Su contraseña de acceso a HabitaU es: " + results[0].password,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email enviado: " + info.response);
          }
        });

        return res
          .status(200)
          .json({
            message:
              "La información fue enviada exitosamente a su correo electronico",
          });
      }
    } else {
      return res.status(500).json({ message: "El correo no existe" });
    }
  });
});

router.get(
  "/getUsers",
  auth.authenticationToken,
  checkRole.checkRole,
  (req, res) => {
    var query = "SELECT * FROM usuarios WHERE role <> 'Administrador'";
    connection.query(query, (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.patch("/updateUser", (req, res) => {
  const usuario = req.body;
  var query =
    "UPDATE usuarios SET first_name=?, last_name=?, phone=?, email=?, username=?, password=?, role=? WHERE id=?";
  connection.query(
    query,
    [
      usuario.first_name,
      usuario.last_name,
      usuario.phone,
      usuario.email,
      usuario.username,
      usuario.password,
      usuario.role,
      usuario.id,
    ],
    (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Usuario actualizado" });
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

router.get("/checkUser", auth.authenticationToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});

router.post("/changePassword", auth.authenticationToken, (req, res) => {
  const usuario = req.body;
  const email = res.locals.email;
  var query = "SELECT * FROM usuarios WHERE email=? AND password=?";
  connection.query(query, [email, usuario.oldPassword], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res
          .status(400)
          .json({ message: "Contraseña antigua incorrecta" });
      } else if (results[0].password == usuario.oldPassword) {
        query = "UPDATE usuarios SET password=? WHERE email=?";
        connection.query(
          query,
          [usuario.newPassword, email],
          (err, results) => {
            if (!err) {
              return res
                .status(200)
                .json({ message: "Contraseña actualizada" });
            } else {
              return res.status(500).json({ err });
            }
          }
        );
      } else {
        return res
          .status(400)
          .json({
            message: "Ha ocurrido un error, por favor intenta de mas tarde",
          });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;
