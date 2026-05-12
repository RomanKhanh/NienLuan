const express = require("express");
require("dotenv").config();
const cors = require("cors");
const apiRouter = require("./routes/api");
const connection = require("./config/database");
const app = express();
const port = process.env.PORT || 8888;

//config cors
app.use(cors());

//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

app.use("/api", apiRouter);

(async () => {
  try {
    // using mongoose
    await connection();

    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
