const { Model, DataTypes } = require("sequelize");

class User extends Model {
    static init(connection) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Name must have a value"},
                },
                unique: {
                    msg: "Name already exists"
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Password must have a value" }
                },
                unique: true
            },
            department_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Field dptm_id (department_id) must not be empty"
                    }
                }
            }
        }, { sequelize: connection });
    };

    static associate(models) {
        this.belongsTo(models.Department, {foreignKey: "department_id", as: "belongs"}); // foreign key goes to on the source
        this.belongsToMany(models.Project, { foreignKey: "user_id", through: "user_projects", as:"projects"})
    }
}

module.exports = User;
