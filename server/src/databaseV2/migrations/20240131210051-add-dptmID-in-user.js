'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn("users", "dptm_id", {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "department",
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
      })
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeColumn("users", "dptm_id");
  }
};
