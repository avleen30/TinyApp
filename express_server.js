var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//creating route for rendering the list or table of the URLs and their shortened forms

app.get("/urls", (req, res) => {
  let templateVars = { urls : urlDatabase };
  res.render("urls_index", templateVars);
})

//creating route for rendering the full URL and its shortened form
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL : req.params.id, longURL : urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});