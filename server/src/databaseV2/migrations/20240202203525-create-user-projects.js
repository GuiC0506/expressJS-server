'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      queryInterface.createTable("user_projects", {
          id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true
          },

          user_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                model: "users",
                key: "id"
              },
              onDelete: "CASCADE",
              onUpdate: "CASCADE"
          },

          project_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: "projects",
                  key: "id"
              },
              onDelete: "CASCADE",
              onUpdate: "CASCADE"
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
      await queryInterface.dropTable("user_projects");
  }
};
