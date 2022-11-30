const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const { PORT, DB_URL } = process.env;

mongoose
  .connect(DB_URL)
  .then(() => console.log("MongoDb Connected"))
  .catch((err) => console.log(err));

app.listen(PORT || 5000, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
