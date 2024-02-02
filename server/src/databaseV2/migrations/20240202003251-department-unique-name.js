'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.changeColumn("departments", "name", {
          type: Sequelize.STRING,
          unique: true
      });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.changeColumn("departments", "name", {
          unique: false
      });
  }
};
