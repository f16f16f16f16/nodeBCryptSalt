const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodeloginX",
});

// 3.use pakages
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 4.change the secret code for the session
// sessions package is what we'll use to determine
//

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 5. client connection to the server
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/home", function (request, response) {
  if (request.session.loggedin) {
    response.send("Welcome back, " + request.session.username + "!");
    //response.redirect("/webboard");
  } else {
    response.send("Please login to view this page!");
  }
  response.end();
});

app.get("/signout", function (request, response) {
  request.session.destroy(function (err) {
    response.send("Signout ready!");
    response.end();
  });
});

app.get("/webboard", (req, res) => {
  if (req.session.loggedin)
    connection.query("SELECT * FROM accounts", (err, results) => {
      res.render("index.ejs", {
        posts: results,
      });
      console.log(results);
    });
  else res.send("You must be logged in to view this page");
  console.log("You must be logged in to view this page");
});

app.get("/add", (req, res) => {
  res.render("add.ejs");
});

app.post("/add", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const post = {
    username: username,
    password: password,
    email: email,
  };
  if (req.session.loggedin)
    connection.query("INSERT INTO accounts SET ?", post, (err) => {
      console.log("Data Inserted");
      return res.redirect("/webboard");
    });
  else res.send("You must be logged in to view this page");
  console.log("You must be logged in to view this page");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const post = {
    username: username,
    password: password,
    email: email,
  };
  if (req.session.loggedin)
    connection.query("INSERT INTO accounts SET ?", post, (err) => {
      console.log("Data Inserted");
      return res.redirect("/webboard");
    });
  else res.send("You must be logged in to view this page");
  console.log("You must be logged in to view this page");
});

app.get("/edit/:id", (req, res) => {
  const edit_postID = req.params.id;

  connection.query(
    "SELECT * FROM accounts WHERE id=?",
    [edit_postID],
    (err, results) => {
      if (results) {
        res.render("edit", {
          post: results[0],
        });
      }
    }
  );
});
app.post("/edit/:id", (req, res) => {
  const update_username = req.body.username;

  const update_password = req.body.password;
  const update_email = req.body.email;
  const id = req.params.id;
  connection.query(
    "UPDATE accounts SET username = ?,password = ?,email = ? WHERE id = ?",
    [update_username, update_password, update_email, id],
    (err, results) => {
      if (results.changedRows === 1) {
        console.log("Post Updated");
      }
      return res.redirect("/webboard");
    }
  );
});

app.get("/delete/:id", (req, res) => {
  connection.query(
    "DELETE FROM accounts WHERE id = ?",
    [req.params.id],
    (err, results) => {
      return res.redirect("/webboard");
    }
  );
});

app.post("/auth", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      (err, results, fields) => {
        if (results.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect("/webboard");
        } else {
          res.send("Incorrect Username and/or Password!");
        }
        res.end();
      }
    );
  } else {
    res.send("Please enter Username and Password");
    res.end();
  }
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", (req, res) => {
  const user_buasri = req.body.username;
  const user_mail = req.body.email;
  const user_password = req.body.password;

  if (user_buasri && user_password) {
    bcrypt.genSalt(10, function (err, salt) {
      console.log(salt);
      comsole.log(user_buasri, user_mail, user_password);
      bcrypt.hash(user_password, salt, function (err, hash) {
        connection.query(
          "INSERT INTO accounts SET username = ?, password = ?,email = ?",
          [user_buasri, hash, user_mail],
          function (err) {
            if (err) {
              console.error();
            }
            req.session.loggedin = true;
            req.session.userID = user_buasri;

            res.redirect("/checklogin");
          }
        );
      });
    });
  }
});

app.get('/checklogin', function (req, res){
    res.sendFile(path.join(__dirname, '/login_auth.html'))
})

app.post('/checklogin', function (req, res){
    var user_buasri = req.body.username
    var user_password = req.body.password

    if(user_buasri && user_password) {
        
    }
})

app.listen(9000);
console.log("listening on http://localhost:9000");
