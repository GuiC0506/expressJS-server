const passport = require("passport");
const { Strategy } = require("passport-local");
const pool = require("../database/db");
const { hashPassword, comparePassword } = require("../utils/helpers");

passport.use(
    // called in every post request that handles authentication
    // for verifing if a user exists
    new Strategy(async (username, password, done) => {
        try {
            const { rows: userRegisters, rowCount } = await pool.query(`select * from users where name = $1`, [username])
            if(!rowCount) throw new Error("User does not exist.");
            const { rows: hashedPassword } = await pool.query(`select name, password from users where name = $1`, [username]);
            const isHashableEqualsPlain = await comparePassword(password, hashedPassword[0].password);
            if(!isHashableEqualsPlain) throw new Error("Bad credentials");
            done(null, userRegisters[0]); // calls the serializeUser function
        } catch(err) {
            done(err, null, {message: err.message});
        }
    })
)

passport.serializeUser((user, done) => {
    console.log(`User with id ${user.id} was validated`);
    // registers validated user id in the session object
    // it is called once in each time a session is created
    done(null, user.id) // user.id is passed to the deserializeUser function
})

passport.deserializeUser(async (userId, done) => {
    console.log("Inside deserializer");
    try {
        //attachs the validated user object to the request object
        // every time a request is made after the first request
        
        const { rows } = await pool.query(`
                select * from users u where u.id = $1
            `, [userId]);
        done(null, rows[0]);
    } catch(err) {
        done(err, null);
    }
})

module.exports = passport;
