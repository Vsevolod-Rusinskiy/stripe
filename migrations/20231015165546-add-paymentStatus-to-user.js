'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.addColumn(
        'Users', // имя таблицы
        'paymentStatus', // имя новой колонки
        {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'Pending'
        }
    );
  },

  async down (queryInterface, Sequelize) {

    return queryInterface.removeColumn('Users', 'paymentStatus');

  }
};
