const cors = require("cors");
const { response } = require("express");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local");

const model = require("./model");
const Gift = model.Gift;
const User = model.User;

const port = process.env.PORT || 8080;

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(
  session({
    secret: "f93uijedifja9dfjksl",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new passportLocal.Strategy(
    {
      usernameField: "email",
      passwordField: "plainPassword",
    },
    function (email, plainPassword, done) {
      // authentication logic goes here

      // check if user exists in db by email
      User.findOne({
        email: email,
      })
        .then(function (user) {
          if (user) {
            // if user exists, verify the password using bcrypt
            user.verifyPassword(plainPassword).then(function (result) {
              if (result) {
                done(null, user);
              } else {
                done(null, false);
              }
            });
          } else {
            done(null, false);
          }
        })
        .catch(function (err) {
          done(err);
        });
      // respond accordingly via the done() function
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (userID, done) {
  User.findOne({ _id: userID })
    .then(function (user) {
      done(null, user);
    })
    .catch(function (err) {
      done(err);
    });
});

app.get("/sessions", function (req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
});

app.post("/sessions", passport.authenticate("local"), function (req, res) {
  // authentication succeeded!!!!
  res.sendStatus(201);
});

app.delete("/sessions", function (req, res) {
  req.logout();
  res.sendStatus(204);
});

app.get("/gifts", (req, res) => {
  // res.set("Access-Control-Allow-Origin", "*");
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  var query = { user: req.user._id };
  // var sort = {}
  // if (req.query.name) {
  //   query.name = req.query.name;
  // }
  // if (req.query.idea) {
  //   query.idea = req.query.idea
  // }
  Gift.find(query).then((gifts) => {
    res.json(gifts);
  });
});

//  BACKEND FILTERING
// app.get("/gifts", (req, res) => {
//   // res.set("Access-Control-Allow-Origin", "*");

//   console.log("the request query params are: ", req.query);
//   var query = { user: req.user._id };
//   var sort = {};
//   if (req.query.name) {
//     query.name = req.query.name;
//   }
//   if (req.query.species) {
//     query.species = req.query.species;
//   }
//   if (req.query.sortBy == "species") {
//     sort.species = "asc";
//   }

//   Gift.find(query)
//     .sort(sort)
//     .then((gifts) => {
//       res.json(gifts);
//     });
// });

// BACKEND FILTERING
app.get("/gifts/:id", (req, res) => {
  Gift.findOne({
    _id: req.params.id,
  })
    .then((gift) => {
      if (gift) {
        res.status(200).json(gift);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((error) => {
      console.error("db query failed:", error);
      res.sendStatus(400);
    });
});

app.post("/gifts", (req, res) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  console.log("raw request body: ", req.body);
  const gift = new Gift({
    name: req.body.name,
    idea: req.body.idea,
    price: req.body.price,
    purchased: req.body.purchased,
    event: req.body.event,
    user: req.user._id,
  });
  gift
    .save()
    .then(() => {
      res.status(201).send("Created");
    })
    .catch((error) => {
      if (error.errors) {
        let errorMessages = {};
        for (let e in error.errors) {
          errorMessages[e] = error.errors[e].message;
        }
        res.status(422).json(errorMessages);
      } else {
        console.error("error occured while creating a gift: ", error);
        res.status(500).send("server error");
      }
    });
});

app.delete("/gifts/:id", (req, res) => {
  // findOne
  // deleteOne
  // if (pet) deleteOne(req.params.id)
  //   res.set("Access-Control-Allow-Origin", "*");
  //   Gift.findByIdAndDelete(req.params.id, (err, gift) => {
  //     res.status(204).json(gift);
  //   });

  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  Gift.findOne({
    _id: req.params.id,
    user: req.user._id,
  })
    .then((gift) => {
      if (gift) {
        Gift.deleteOne({
          _id: req.params.id,
        }).then(() => {
          res.sendStatus(204);
        });
      } else {
        res.sendStatus(404);
      }
    })
    .catch((error) => {
      console.error("db query failed:", error);
      res.sendStatus(400);
    });
});

app.put("/gifts/:id", (req, res) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const gift = new Gift({
    _id: req.params.id,
    name: req.body.name,
    idea: req.body.idea,
    price: req.body.price,
    purchased: req.body.purchased,
    event: req.body.event,
    user: req.user._id,
  });
  Gift.updateOne({ _id: req.params.id }, gift)
    .then(() => {
      res.status(201).json({
        message: "Gift updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

app.patch("/gifts/:id", (req, res) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  const gift = new Gift({
    _id: req.params.id,
    name: req.body.name,
    idea: req.body.idea,
    price: req.body.price,
    purchased: req.body.purchased,
    event: req.body.event,
    user: req.user._id,
  });
  Gift.updateOne({ _id: req.params.id }, gift)
    .then(() => {
      res.status(201).json({
        message: "Gift updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

app.post("/users", (req, res) => {
  // post stuff
  var user = new User({
    firstName: req.body.firstName,
    email: req.body.email,
  });
  user.setEncryptedPassword(req.body.password).then(function () {
    // promise has now been fulfilled
    user
      .save()
      .then(() => {
        res.status(201).send("Created");
      })
      .catch((error) => {
        if (error.code == 11000) {
          // handle something
          res.status(422).json("email in use");
          //console.log("this worked")
        } else if (error.errors) {
          let errorMessages = {};
          for (let e in error.errors) {
            errorMessages[e] = error.errors[e].message;
          }
          res.status(422).json(errorMessages);
        } else {
          console.error("error occured while creating a gift: ", error);
          res.status(500).send("server error");
        }
      });
  });
});

app.listen(port, () => {
  console.log(`Listening at: http://localhost:${port}`);
});
