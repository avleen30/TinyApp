var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

//The body-parser library will allow us to access POST request parameters,
//such as req.body.longURL, which we will store in a variable called urlDatabase

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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

//We will use the urls_new.ejs template to render the endpoint, /urls/new.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//the urls_new.ejs template that we created uses method="post".
//This corresponds with the app.post(...) on the server-side code!
app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});