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

//We will use the urls_new.ejs template to render the endpoint, /urls/new.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//the urls_new.ejs template that we created uses method="post".
//This corresponds with the app.post(...) on the server-side code!
app.post("/urls", (req, res) => {
  //first take the user input (long URL) and run function to convert is to a key
  let shortURL = generateRandomString(req.body.longURL);
  //assign that key (shortURL) to the longURL and push it into urlDatabase
  urlDatabase[shortURL] = req.body.longURL;
  //redirect client to urls which will display the short and long URLS
  res.redirect("/urls");
});

//creating route for rendering the full URL and its shortened form
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL : req.params.id, longURL : urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//function for generating a random 6 string
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
   return text;
}