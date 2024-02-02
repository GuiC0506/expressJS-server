'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable("projects", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },

        owner_id: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "id"
            }
        },

        created_at: {
            type: Sequelize.DATE,
            allowNull: false
        },

        updated_at: {
            type: Sequelize.DATE,
            allowNull: false
        }
    })
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable("projects");
  }
};
