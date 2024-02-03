const { Model, DataTypes } = require("sequelize");

class Project extends Model {
    static init(connection) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Field \"name\" must not be empty"
                    }
                }
            },
            owner_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {sequelize: connection})
    }

    static associate(models) {
        this.belongsToMany(models.User, { foreignKey: "project_id", through: "user_projects", as:"users"}) }
}

module.exports = Project;
