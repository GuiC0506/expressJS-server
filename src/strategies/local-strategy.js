const passport = require("passport");
const { Strategy } = require("passport-local");
const pool = require("../database/db");

passport.use(
    // called in every post request that handles authentication
    // for verifing if a user exists
    new Strategy(async (username, password, done) => {
        try {
            const result = await pool.query(`select * from users u 
                                        where u.name = $1 and u.password = $2`,
                                        [username, password]
                                    );
            if(!result.rowCount) {
                throw new Error("Bad credentials");
            } else {
                done(null, result.rows[0]); // calls the serializeUser function
            }
        } catch(err) {
            done(err, null, {message: err.message.error});
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
