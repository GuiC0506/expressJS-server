const passport = require("passport");
const { Strategy } = require("passport-local");
const { users } = require("../utils/constants");

passport.use(
    // called in every post request that handles authentication
    // for verifing if a user exists
    new Strategy((username, password, done) => {
        console.log("Validating user credentials");
        try {
            const findUser = users.find(user => user.username === username);
            if(!findUser) throw new Error("User not found.");
            if(!findUser.password === password) throw new Error("Invalid credentials");
            done(null, findUser); // calls the serializeUser function
        } catch(err) {
            done(err, null)
        }
    })
)

passport.serializeUser((user, done) => {
    console.log(`User with id ${user.id} was validated`);
    // registers validated user id in the session object
    // it is called once in each time a session is created
    done(null, user.id) // user.id is passed to the deserializeUser function
})

passport.deserializeUser((userId, done) => {
    console.log("Inside deserializer");
    try {
        //attachs the validated user object to the request object
        // every time a request is made after the first request
        const findUser = users.find(user => user.id === userId);
        done(null, findUser);
    } catch(err) {
        done(err, null);
    }
})

module.exports = passport;
