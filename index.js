const express = require("express");
var cors = require("cors");

const connection = require("./connection.js");
const userRouter = require("./routes/usuariosRoutes.js");
const propertyRouter = require("./routes/tipopropiedadRoutes.js");
const universityRouter = require("./routes/universidadesRoutes.js");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRouter);
app.use("/property", propertyRouter);
app.use("/university", universityRouter);

module.exports = app;
