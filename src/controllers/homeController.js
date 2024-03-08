import db from '../models/index'
import CRUDService from '../services/CRUDService'

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll({ raw: true })
    return res.render('homepage.ejs', { dataTable: data })
  } catch (error) {
    console.log('error from getHomePage', error)
  }
}

let getCrud = (req, res) => {
  try {
    return res.render('crud.ejs')
  } catch (error) {
    console.log('error from getCrud', error)
  }
}

let postCRUD = async (req, res) => {
  try {
    let message = await CRUDService.createNewUser(req.body)
    return res.send('success')
  } catch (error) {
    console.log('error from postCRUD', error)
  }
}

let displayGetCRUD = async (req, res) => {
  try {
    let data = await CRUDService.getAllUser()
    return res.render('display-CRUD.ejs', { dataTable: data })
  } catch (error) {
    console.log('error from postCRUD', error)
  }
}

let displayEditCRUD = async (req, res) => {
  try {
    let userId = req.query.id
    if (userId) {
      let userData = await CRUDService.getUserInfoById(userId)
      return res.render('editCRUD.ejs', {
        userData: userData,
      })
    } else {
      return res.send('user not found from  displayEditCRUD')
    }
  } catch (error) {
    console.log('error from displayEditCRUD', error)
  }
}

let putCRUD = async (req, res) => {
  try {
    let data = req.body
    let allUser = await CRUDService.updateUserData(data)
    return res.render('display-CRUD.ejs', { dataTable: allUser })
  } catch (error) {
    console.log('error from putCRUD', error)
  }
}

let deleteCRUD = async (req, res) => {
  try {
    let id = req.query.id
    if (id) {
      await CRUDService.deleteUserById(id)
      return res.send('delete success')
    } else {
      return res.send('not found')
    }
  } catch (error) {
    console.log('error from putCRUD', error)
  }
}

module.exports = {
  getHomePage,
  getCrud,
  postCRUD,
  displayGetCRUD,
  displayEditCRUD,
  putCRUD,
  deleteCRUD,
}
