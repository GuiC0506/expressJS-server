const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database");
const User = require("../models/User");
const Department = require("../models/Department");

const connection  = new Sequelize(dbConfig);

User.init(connection);
User.init(connection);

module.exports = connection;

