import db from '../models/index'
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid'

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
  return result
}

const postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address
      ) {
        console.log(data)
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter',
        })
      } else {
        let token = uuidv4()

        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        })

        let user = await db.User.findOrCreate({
          where: {
            email: data.email,
          },
          attributes: { exclude: ['password'] },
          defaults: {
            email: data.email,
            roleId: 'R3',
            address: data.address,
            gender: data.selectedGender,
            firstName: data.fullName,
          },
          raw: true,
        })

        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: {
              patientId: user[0].id,
            },
            defaults: {
              statusId: 'S1',
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
          })
        }
        resolve({
          errCode: 0,
          errMessage: 'Save info successfully',
        })
      }
    } catch (error) {
      console.log(error)
      reject(
        resolve({
          errCode: 2,
          errMessage: 'Missing from err postBookAppointment',
        }),
      )
    }
  })
}

const postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter',
        })
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: 'S1',
          },
          raw: false,
        })
        if (appointment) {
          appointment.statusId = 'S2'
          await appointment.save()
          resolve({
            errCode: 0,
            errMessage: 'Update the appointment success',
          })
        } else {
          resolve({
            errCode: 2,
            errMessage:
              'Appointment schedule has been activated or does not exist !!',
          })
        }
      }
    } catch (error) {
      console.log(error)
      reject({
        errCode: 2,
        errMessage: 'error from postVerifyBookAppointment',
      })
    }
  })
}

module.exports = {
  postBookAppointment,
  postVerifyBookAppointment,
}
