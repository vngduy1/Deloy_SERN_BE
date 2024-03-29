import db from '../models/index'
require('dotenv').config()
import _ from 'lodash'
import emailService from './emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

const getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: 'R2' },
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] },
        include: [
          {
            model: db.Allcode,
            as: 'positionData',
            attributes: ['valueEn', 'valueVi'],
          },
          {
            model: db.Allcode,
            as: 'genderData',
            attributes: ['valueEn', 'valueVi'],
          },
        ],
        raw: true,
        nest: true,
      })

      resolve({
        errCode: 0,
        data: users,
      })
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

const getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: 'R2' },

        attributes: { exclude: ['password'] },
        raw: true,
        nest: true,
      })

      resolve({
        errCode: 0,
        data: doctors,
      })
    } catch (error) {
      console.log(error)
      reject({
        errCode: 1,
        errMessage: 'getAllDoctors error',
      })
    }
  })
}

const checkRequiredFields = (inputData) => {
  let arrFields = [
    'doctorId',
    'contentHTML',
    'contentMarkdown',
    'action',
    'selectedPrice',
    'selectedPayment',
    'selectedProvince',
    'nameClinic',
    'addressClinic',
    'note',
    'specialtyId',
  ]
  let isValid = true
  let element = ''
  for (var i = 0; i < arrFields.length; i++) {
    if (!inputData[arrFields[i]]) {
      isValid = false
      element = arrFields[i]
      break
    }
  }
  return {
    isValid,
    element,
  }
}

const saveDetailInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredFields(inputData)
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing parameter saveDetailInfoDoctor ${checkObj.element}`,
        })
      } else {
        //upsert to Markdown
        if (inputData.action === 'ADD') {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          })
        } else if (inputData.action === 'EDIT') {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          })
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown
            doctorMarkdown.description = inputData.description
            await doctorMarkdown.save()
          }
        }

        //upsert to Doctor info table
        let doctorInfo = await db.Doctor_Info.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        })
        if (doctorInfo) {
          //update
          doctorInfo.priceId = inputData.selectedPrice
          doctorInfo.paymentId = inputData.selectedPayment
          doctorInfo.provinceId = inputData.selectedProvince
          doctorInfo.nameClinic = inputData.nameClinic
          doctorInfo.addressClinic = inputData.addressClinic
          doctorInfo.note = inputData.note
          doctorInfo.specialtyId = inputData.specialtyId
          doctorInfo.clinicId = inputData.clinicId
          await doctorInfo.save()
        } else {
          //create
          await db.Doctor_Info.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            paymentId: inputData.selectedPayment,
            provinceId: inputData.selectedProvince,
            nameClinic: inputData.nameClinic,
            addressClinic: inputData.addressClinic,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
          })
        }
        resolve({
          errCode: 0,
          errMessage: 'Save info doctor success',
        })
      }
    } catch (error) {
      console.log(error)
      reject({ errCode: -1, errMessage: 'error from saveDetailInfoDoctor' })
    }
  })
}

const getDetailDoctorByIdService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter getDetailDoctorByIdService',
        })
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: { exclude: ['password'] },
          include: [
            {
              model: db.Markdown,
              attributes: ['description', 'contentHTML', 'contentMarkdown'],
            },
            {
              model: db.Allcode,
              as: 'positionData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ['id', 'doctorId'],
              },
              include: [
                {
                  model: db.Allcode,
                  as: 'priceTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'paymentTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'provinceTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        })

        if (data && data.image) {
          data.image = Buffer.from(data.image).toString('base64')
        }

        if (!data) data = {}
        resolve({
          errCode: 0,
          data: data,
        })
      }
    } catch (error) {
      console.log(error)
      reject({
        errCode: -1,
        errMessage: 'error from getDetailDoctorByIdService',
      })
    }
  })
}

const buildCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required param!',
        })
      } else {
        let schedule = data.arrSchedule
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE
            return item
          })
        }
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date },
          attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
          raw: true,
        })
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date
        })
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate)
        }
        resolve({
          errCode: 0,
          errMessage: 'ok',
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}

const getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing from getScheduleByDate',
        })
      } else {
        let data = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: 'timeTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.User,
              as: 'doctorData',
              attributes: ['firstName', 'lastName'],
            },
          ],
        })

        if (!data) {
          data = []
        }

        resolve({
          errCode: 0,
          data: data,
          errMessage: 'success fully',
        })
      }
    } catch (error) {
      reject(
        resolve({
          errCode: 2,
          errMessage: 'Missing from err getScheduleByDate',
        }),
      )
    }
  })
}

const getExtraInfoDoctorById = (idInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idInput) {
        resolve({
          errCode: 1,
          errMessage: 'Missing from getExtraInfoDoctorById',
        })
      } else {
        let data = await db.Doctor_Info.findOne({
          where: {
            doctorId: idInput,
          },
          attributes: {
            exclude: ['id', 'doctorId'],
          },
          include: [
            {
              model: db.Allcode,
              as: 'priceTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Allcode,
              as: 'paymentTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Allcode,
              as: 'provinceTypeData',
              attributes: ['valueEn', 'valueVi'],
            },
          ],
          raw: false,
          nest: true,
        })
        if (!data) data = {}
        resolve({
          errCode: 0,
          data: data,
          errMessage: 'success fully',
        })
      }
    } catch (error) {
      reject(
        resolve({
          errCode: 2,
          errMessage: 'Missing from err getExtraInfoDoctorById',
        }),
      )
    }
  })
}

const getProfileDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing from getProfileDoctorById',
        })
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: { exclude: ['password'] },
          include: [
            {
              model: db.Markdown,
              attributes: ['description', 'contentHTML', 'contentMarkdown'],
            },
            {
              model: db.Allcode,
              as: 'positionData',
              attributes: ['valueEn', 'valueVi'],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ['id', 'doctorId'],
              },
              include: [
                {
                  model: db.Allcode,
                  as: 'priceTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'paymentTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
                {
                  model: db.Allcode,
                  as: 'provinceTypeData',
                  attributes: ['valueEn', 'valueVi'],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        })

        if (data && data.image) {
          return data.image
          // data.image = Buffer.from(data.image, 'base64').toString('ascii')
        }

        if (!data) data = {}
        resolve({
          errCode: 0,
          data: data,
        })
      }
    } catch (error) {
      reject(
        resolve({
          errCode: 2,
          errMessage: 'Missing from err getProfileDoctorById',
        }),
      )
    }
  })
}

const getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required getListPatientForDoctor',
        })
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: 'S2',
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: 'patientData',
              attributes: ['email', 'firstName', 'address', 'gender'],

              include: [
                {
                  model: db.Allcode,
                  as: 'genderData',
                  attributes: ['valueEn', 'valueVi'],
                },
              ],
            },
            {
              model: db.Allcode,
              as: 'timeTypeDataPatient',
              attributes: ['valueEn', 'valueVi'],
            },
          ],
          raw: false,
          nest: true,
        })
        resolve({
          errCode: 0,
          data: data,
        })
      }
    } catch (error) {
      console.log(error)
      reject(
        resolve({
          errCode: 2,
          errMessage: 'Missing from err getListPatientForDoctor',
        }),
      )
    }
  })
}

const sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required sendRemedy',
        })
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: 'S2',
          },
          raw: false,
        })
        if (appointment) {
          appointment.statusId = 'S3'
          await appointment.save()
        }
        await emailService.sendAttachments(data)
        resolve({
          errCode: 0,
          errMessage: 'email success',
        })
      }
    } catch (error) {
      console.log(error)
      reject(
        resolve({
          errCode: 2,
          errMessage: 'Missing from err sendRemedy',
        }),
      )
    }
  })
}

module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  saveDetailInfoDoctor,
  getDetailDoctorByIdService,
  buildCreateSchedule,
  getScheduleByDate,
  getExtraInfoDoctorById,
  getProfileDoctorById,
  getListPatientForDoctor,
  sendRemedy,
}
