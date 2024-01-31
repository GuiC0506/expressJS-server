const { Model, DataTypes } = require("sequelize");

class Department extends Model {
    static init(connection) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Name field must not be empty"
                    }
                }
            },
            owner: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                            msg: "Field owner must not be empty"
                    }
                }
            }
        }, {sequelize: connection})
    }
}
