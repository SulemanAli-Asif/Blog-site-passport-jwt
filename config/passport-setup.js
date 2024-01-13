const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../server/model/User");
const { google } = require("./keys");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });

});

passport.use(
  new GoogleStrategy(
    {
      clientID: google.clientID,
      clientSecret: google.clientSecret,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile.id, profile.displayName);
     
      // User.create({
      //   username: profile.displayName,
      //   googleId: profile.id,
      // })
      // .then(newUser => {
      //   console.log('Created new user:', newUser);
      //   done(null, newUser);
      // })
      // .catch(createErr => {
      //   console.error('Error creating user:', createErr);
      //   done(createErr, null);
      // });
      User.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            new User({
                googleId: profile.id,
                username: profile.displayName,
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    });
      }
    
  )
);


