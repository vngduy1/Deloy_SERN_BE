import doctorService from '../services/doctorService'

const getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit
  if (!limit) limit = 10

  try {
    let response = await doctorService.getTopDoctorHome(+limit)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getTopDoctorHome',
    })
  }
}

const getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors()
    return res.status(200).json(doctors)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getAllDoctor',
    })
  }
}

const postInfoDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInfoDoctor(req.body)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from postInfoDoctor',
    })
  }
}

const getDetailDoctorById = async (req, res) => {
  try {
    let info = await doctorService.getDetailDoctorByIdService(req.query.id)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getDetailDoctorById',
    })
  }
}

const buildCreateSchedule = async (req, res) => {
  try {
    let info = await doctorService.buildCreateSchedule(req.body)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from buildCreateSchedule',
    })
  }
}

const getScheduleByDate = async (req, res) => {
  try {
    let info = await doctorService.getScheduleByDate(
      req.query.doctorId,
      req.query.date,
    )
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from buildCreateSchedule',
    })
  }
}

const getExtraInfoDoctorById = async (req, res) => {
  try {
    let info = await doctorService.getExtraInfoDoctorById(req.query.doctorId)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getExtraInfoDoctorById',
    })
  }
}

const getProfileDoctorById = async (req, res) => {
  try {
    let info = await doctorService.getProfileDoctorById(req.query.doctorId)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getProfileDoctorById',
    })
  }
}

const getListPatientForDoctor = async (req, res) => {
  try {
    let info = await doctorService.getListPatientForDoctor(
      req.query.doctorId,
      req.query.date,
    )
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getListPatientForDoctor controller',
    })
  }
}

const sendRemedy = async (req, res) => {
  try {
    let info = await doctorService.sendRemedy(req.body)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from sendRemedy controller',
    })
  }
}

module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  postInfoDoctor,
  getDetailDoctorById,
  buildCreateSchedule,
  getScheduleByDate,
  getExtraInfoDoctorById,
  getProfileDoctorById,
  getListPatientForDoctor,
  sendRemedy,
}
