'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    static associate(models) {
      //Định danh các mối quan hệ
    }
  }
  Clinic.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      image: DataTypes.TEXT,
      descriptionHTML: DataTypes.TEXT,
      descriptionMarkdown: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Clinic',
    },
  )
  return Clinic
}
