// for request body validation
const userCreationSchema = {
    username: {
        isString: true,
        notEmpty: {
            errorMessage: "Field can not be empty."
        },
    },
    displayName: {
        isString: true,
        notEmpty: {
            errorMessage: "Field can not be empty."
        },
        isLength: {
            options: {
                min: 3,
                max: 20
            },
            errorMessage: "Field must be min 3 and max 20 characters."
        }
    }
}

module.exports = userCreationSchema;
