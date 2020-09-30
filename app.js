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

app.get("/", async (req, res) => {
  const { name } = req.query;
  if (name) {
    await CurrentModel.findOne(
      {
        name,
      },
      async function (err, visitor) {
        if (err) {
          console.error(err);
        }
        if (visitor) {
          visitor.count = visitor.count + 1;
          await visitor.save();
        } else {
          await CurrentModel.create({
            name,
          });
        }
      }
    );
  } else {
    await CurrentModel.create({
      name: "Anónimo",
    });
  }

  CurrentModel.find({}, function (err, visitors) {
    if (err) {
      return console.error(err);
    }

    let template = "<table><tr><th>Id</th><th>Name</th><th>Visits</th></tr>";

    visitors.forEach((visitor) => {
      template += `<tr>
        <td>${visitor.id}</td>
        <td>${visitor.name}</td>
        <td>${visitor.count}</td>
        </tr>`;
    });
    template += "</table>";

    res.send(template);
  });
});

app.listen(3000, () => console.log("listening on port 3000!"));
