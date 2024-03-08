'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Doctor_Info extends Model {
    static associate(models) {
      //Định danh các mối quan hệ
      Doctor_Info.belongsTo(models.User, {
        foreignKey: 'doctorId',
      })
      Doctor_Info.belongsTo(models.Allcode, {
        foreignKey: 'priceId',
        targetKey: 'keyMap',
        as: 'priceTypeData',
      })
      Doctor_Info.belongsTo(models.Allcode, {
        foreignKey: 'paymentId',
        targetKey: 'keyMap',
        as: 'paymentTypeData',
      })
      Doctor_Info.belongsTo(models.Allcode, {
        foreignKey: 'provinceId',
        targetKey: 'keyMap',
        as: 'provinceTypeData',
      })
    }
  }
  Doctor_Info.init(
    {
      doctorId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Doctor_Info',
      freezeTableName: true,
    },
  )
  return Doctor_Info
}
