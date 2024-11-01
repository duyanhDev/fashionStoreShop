const express = require("express");
const app = express();
const connectDB = require("./Config/db");
const RouterAPI = require("./Routes/Routes");
require("dotenv").config();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const port = process.env.PORT;

app.use(express.json());
app.use(fileUpload());
app.get("/", (req, res) => {
  res.send("Hello World 1234 !");
});
app.use(cors());
app.use("/api/v1/", RouterAPI);

(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Backend zero app listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>check error connection db", error);
  }
})();
