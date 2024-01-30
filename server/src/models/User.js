const { Model, DataTypes } = require("sequelize");

class User extends Model {
    static init(connection) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Name must have a value"},
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Password must have a value" }
                },
                unique: true
            }
        }, { sequelize: connection });
    }
}

module.exports = User;
