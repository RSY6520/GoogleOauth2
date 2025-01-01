require('dotenv');

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
console.log(process.env.GOOGLE_CLIENT_ID);

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy({
        clientID: "",
        clientSecret: "",
        callbackURL: 'http://localhost:5000/auth/google/callback'
    }, 
    (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


app.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Login With google</a>");
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"]}));

app.get("/auth/google/callback", passport.authenticate('google', {failureRedirect: "/"}), (req, res) => {
    res.redirect('/profile');
});

app.get('/profile', (req, res) => {
    res.send(`Welcome ${req.user.displayName}!`)
});

app.get('/logout', (req, res) => {
    req.logOut(() => {
       return res.redirect("/");
    });
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000!"); 
});
