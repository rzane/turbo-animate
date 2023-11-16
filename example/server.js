import express from "express";
import nunjucks from "nunjucks";

const app = express();
const port = parseInt(process.env.PORT || "9000")

app.get("/", (_req, res) => res.render("index.html"));
app.get("/about", (_req, res) => res.render("about.html"));
app.get("/redirect", (_req, res) => res.redirect("/about"));
app.get("/form", (_req, res) => res.render("form.html"));
app.post("/form", (_req, res) => res.redirect(303, "/"));

app.get("/turbo-animate.js", (_req, res) => {
  res.sendFile("turbo-animate.js", { root: process.cwd() });
});

nunjucks.configure("example", {
  autoescape: true,
  express: app
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}...`);
});
