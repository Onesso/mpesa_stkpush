const express = require("express");

const app = express();

const  TokenRoute  = require("./routes/token");

const port = 5000;

app.use(express.json());

app.use("/token", TokenRoute);

app.get("/", (req, res) => {
    res.send("mpesa is runing");
  });

app.listen(port, () => {
  console.log("Server is runing... ");
});




