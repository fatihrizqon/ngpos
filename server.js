const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("./dist/ngpos/"));
app.get("/*", (req, res) =>
  res.sendFile("index.html", { root: "dist/ngpos/" })
);

app.listen(process.env.PORT || 8080);

/**
 * init - add - commit
 * heroku login
 * heroku git:remote -a ngpos
 *
 */
