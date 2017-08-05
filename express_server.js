var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

var cookie = require('cookie');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//The body-parser library will allow us to access POST request parameters,
//such as req.body.longURL, which we will store in a variable called urlDatabase

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//used to store and access the users in the app.
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

//creating route for rendering the list or table of the URLs and their shortened forms
app.get("/urls", (req, res) => {
  var user = checkUSerCookie(req.cookies);
  let templateVars = { urls : urlDatabase , user : user};
  res.render("urls_index", templateVars);
});

//We will use the urls_new.ejs template to render the endpoint, /urls/new.
app.get("/urls/new", (req, res) => {
  var user = checkUSerCookie(req.cookies);
  let templateVars = {user : user};
  res.render("urls_new", templateVars);
});

//creating route for rendering the full URL and its shortened form
app.get("/urls/:id", (req, res) => {
  var user = checkUSerCookie(req.cookies);
  let templateVars = { shortURL : req.params.id, longURL : urlDatabase[req.params.id], user : user};

  res.render("urls_show", templateVars);
});

//the urls_new.ejs template that we created uses method="post".
//This corresponds with the app.post(...) on the server-side code!
app.post("/urls", (req, res) => {
  //first take the user input (long URL) and run function to convert is to a key
  let shortURL = generateRandomString(req.body.longURL);
  //assign that key (shortURL) to the longURL and push it into urlDatabase
  urlDatabase[shortURL] = req.body.longURL;
  //redirect client to urls which will display the short and long URLS
  res.redirect(`/urls/${shortURL}`);
});

//The next part of the specification is that a URL like http://localhost:8080/u/b2xVn2
//would redirect to its corresponding longURL (www.lighthouselabs.ca) according to our urlDatabase.
// add the following route to handle shortURL requests:
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//Implement the /logout endpoint so that
//it clears the username cookie and redirects the user back to the /urls page
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("urls")
});

//In order to handle the form submission, add an endpoint to handle a POST to /login in your Express server.
//Use the endpoint to set the cookie parameter called username to the value submitted in the request body via the form
app.post("/login", (req, res) => {
  console.log('In the post login route')
  let email = req.body.email
  let password = req.body.password;
    for(var key in users){
      if(email === users[key].email && password === users[key].password){
        res.cookie("user_id", users[key].id);
        res.redirect("/urls");
      }
    }
    res.redirect("/login");
});

// /Create a GET /register endpoint,
// which returns a page that includes a form with an email and password field.
app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.post("/register", (req, res) => {

    var key = generateRandomString();
    let userInput = { id : key, email : req.body.email , password : req.body.password};

    if (!userInput.email || !userInput.password){
      // return Error 400
      res.status(400).send("Error, please register")
        return;
      }

    for (let user in users) {
      if (userInput.email === users[user]["email"]) {
        res.status(400).send("Error - please use new email")
        return;
      }
    }
    //pushing email and password into users database
    users[key]= userInput;
    //saving user_id as cookie
    res.cookie("user_id", userInput.id);
    res.redirect("/urls");
});

//Create a GET /login endpoint, which returns a new login page (you'll have to create it).
//Move the entire login form from the _header partial into the new login page, then modify the form
//to ask for an email and password.
app.get("/login", (req, res) => {
  console.log('In the get login route')
  var user = checkUSerCookie(req.cookies);
  let templateVars = {user : user};
  res.render("urls_login", templateVars);
});

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
};

function checkUSerCookie(cookie){
  //check if cookie exists
  if(cookie['user_id']) {
    let user = users[cookie['user_id']];
    return user;
  } else {
    return {};
  }
}