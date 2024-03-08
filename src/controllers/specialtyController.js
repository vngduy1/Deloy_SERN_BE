import specialtyService from '../services/specialtyService'

const createSpecialty = async (req, res) => {
  try {
    let info = await specialtyService.createSpecialty(req.body)
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from createSpecialty',
    })
  }
}

const getAllSpecialty = async (req, res) => {
  try {
    let info = await specialtyService.getAllSpecialty()
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getAllSpecialty',
    })
  }
}

const getDetailSpecialtyById = async (req, res) => {
  try {
    let info = await specialtyService.getDetailSpecialtyById(
      req.query.id,
      req.query.location,
    )
    return res.status(200).json(info)
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from getDetailSpecialty',
    })
  }
}

module.exports = {
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
}
