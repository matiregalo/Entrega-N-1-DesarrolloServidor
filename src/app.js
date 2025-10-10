import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Hola Mundo" });
});

app.listen(8080, () => {
  console.log("Servidor iniciado correctamente en el puerto 8080");
});
