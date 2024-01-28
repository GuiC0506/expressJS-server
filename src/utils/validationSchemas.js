// for request body validation
const userCreationSchema = {
    username: {
        notEmpty: {
            errorMessage: "Field can not be empty."
        },
    },
    displayName: {
        notEmpty: {
            errorMessage: "Field can not be empty."
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Field can not be empty."
        },
    }
}

const userQueryParamsSchema = {
    filter: {
        isString: true,
        notEmpty: {
            errorMessage: "Field can not be empty."
        },
        isLength: {
            options: {
                min: 3,
                max: 15
            },
            errorMessage: "Field must be at least 3-10 characters"
        }
    }
}

module.exports = {
    userCreationSchema,
    userQueryParamsSchema
};
