/*
  # Add Language Setting to Settings

  1. Changes
    - Add `language` column to settings (defaults to 'en')
    - Allows users to select interface language (English or Russian)

  2. Notes
    - Language preference is stored both in database and localStorage
    - Supports 'en' (English) and 'ru' (Russian)
    - Existing installations will default to English
*/

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('settings', 'language', {
      type: Sequelize.STRING(2),
      allowNull: true,
      defaultValue: 'en',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('settings', 'language');
  },
};
