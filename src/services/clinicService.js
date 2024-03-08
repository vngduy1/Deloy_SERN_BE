import db from '../models/index'

let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: -1,
          errMessage: 'Missing parameter',
        })
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
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

const getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll({})

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
        errMessage: 'Missing from getAllClinic',
      })
    }
  })
}

const getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: -1,
          errMessage: 'Missing parameter from getDetailClinicById',
        })
      } else {
        let data = await db.Clinic.findOne({
          where: { id: inputId },
          attributes: [
            'descriptionHTML',
            'descriptionMarkdown',
            'name',
            'address',
          ],
          raw: true,
        })

        if (data) {
          let doctorClinic = []
          doctorClinic = await db.Doctor_Info.findAll({
            where: { clinicId: inputId },
            attributes: ['doctorId', 'provinceId'],
          })
          data.doctorClinic = doctorClinic
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
        errMessage: 'Missing from getDetailClinicById',
      })
    }
  })
}

module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
}
