const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database");
const User = require("../models/User");
const Department = require("../models/Department");

const connection = new Sequelize(dbConfig);

User.init(connection);
Department.init(connection);
User.associate(connection.models); // start relationships
Department.associate(connection.models); // start relationships

module.exports = connection;

