import { raw } from 'body-parser'
import db from '../models/index'

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: -1,
          errMessage: 'Missing parameter',
        })
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        })
        resolve({
          errCode: 0,
          errMessage: 'Create successfully',
        })
      }
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

const getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll({})

      if (!data) {
        resolve({
          errCode: -1,
          errMessage: 'NULL!!!!',
        })
      }
      if (data && data.length > 0) {
        data.map((item) => {
          return item.image
          // item.image = Buffer.from(item.image, 'base64').toString('ascii')
        })
      }

      resolve({
        errCode: 0,
        data,
      })
    } catch (error) {
      console.log(error)
      reject({
        errCode: 2,
        errMessage: 'Missing from getAllSpecialty',
      })
    }
  })
}

const getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: -1,
          errMessage: 'Missing parameter from getDetailSpecialtyById',
        })
      } else {
        let data = await db.Specialty.findOne({
          where: { id: inputId },
          attributes: ['descriptionHTML', 'descriptionMarkdown'],
          raw: true,
        })

        if (data) {
          let doctorSpecialty = []
          if (location === 'ALL') {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: { specialtyId: inputId },
              attributes: ['doctorId', 'provinceId'],
            })
            data.doctorSpecialty = doctorSpecialty
          } else {
            //find by location
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: {
                specialtyId: inputId,
                provinceId: location,
              },
              attributes: ['doctorId', 'provinceId'],
            })
            data.doctorSpecialty = doctorSpecialty
          }
        } else {
          data = {}
        }
        resolve({
          errCode: 0,
          errMessage: 'ok',
          data: data,
        })
      }
    } catch (error) {
      console.log(error)
      reject({
        errCode: 2,
        errMessage: 'Missing from getDetailSpecialtyById',
      })
    }
  })
}

module.exports = {
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
}
