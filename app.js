const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost:27017/mongo1",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("error", function (error) {
  console.log("MONGOOSE ERROR", error);
});

const CurrentVisitor = mongoose.Schema({
  name: String,
  count: {
    type: Number,
    default: 1,
  },
});

const CurrentModel = mongoose.model("Visitor", CurrentVisitor);

app.get("/", (req, res) => {
  const { name } = req.query;
  CurrentModel.findOne(
    {
      name,
    },
    function (err, visitor) {
      if (err) {
        console.error(err);
      }
      if (visitor) {
        visitor.count = visitor.count + 1;
        visitor.save();
      } else {
        CurrentModel.create({
          name: name ? name : "Anónimo",
        });
      }
    }
  );

  res.send("<h1>Revisar Mongo a ver</h1>");
});

app.listen(3000, () => console.log("listening on port 3000!"));
