require('dotenv').config()
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  })

  const info = await transporter.sendMail({
    from: '"DVN" <DvnDev126@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: 'Thông tin đặt lịch khám bệnh', // Subject line
    html: getBodyHTMLEmail(dataSend), // html body
  })
}

const getBodyHTMLEmail = (dataSend) => {
  let result = ''
  if (dataSend.language === 'vi') {
    return (result = ` <h3>Xin chào ${dataSend.patientName}</h3> 
    <p>Bạn nhận được email này vì đã nhận được lịch khám bệnh online trên DVNBooking</p>
    <p>Thông tin đặt lịch khám bệnh : </p>
    <div><b>Thời gian : ${dataSend.time} </b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName} </b></div>

    <p>Nếu các thông tin là đúng sự thật vui lòng click vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh. </P>
    <div>
    <a href=${dataSend.redirectLink} target="_blank"> Nhấn vào đây </a>
    </div>
    <div>Xin chân thành cảm ơn</div>
  `)
  }
  if (dataSend.language === 'en') {
    return (result = ` <h3>Dear ${dataSend.patientName}</h3> 
    <p>You have received this email because you have received an online booking on DVNBooking</p>
    <p>Information on scheduling medical examinations : </p>
    <div><b>Time : ${dataSend.time} </b></div>
    <div><b>Doctor: ${dataSend.doctorName} </b></div>

    <p>If the information is true, please click on the link below to complete the procedure for scheduling a medical examination.</P>
    <div>
    <a href=${dataSend.redirectLink} target="_blank"> Click here </a>
    </div>
    <div>Thank you !!!</div>
  `)
  }
  return result
}

const sendAttachments = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  })

  const info = await transporter.sendMail({
    from: '"DVN" <DvnDev126@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: 'Kêt quả đặt lịch khám bệnh', // Subject line
    html: getBodyHTMLEmailRemedy(dataSend), // html body,
    attachments: [
      {
        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
        content: dataSend.imgBase64.split('base64')[1],
        encoding: 'base64',
      },
    ],
  })
}

const getBodyHTMLEmailRemedy = (dataSend) => {
  let result = ''
  if (dataSend.language === 'vi') {
    return (result = ` <h3>Xin chào ${dataSend.patientName}</h3> 
    <p>Bạn nhận được email này vì đã nhận được lịch khám bệnh online trên DVNBooking thành công</p>
    <p>Thông tin đơn thuốc được gửi trong file đính kèm</p>

    <div>Xin chân thành cảm ơn</div>
  `)
  }
  if (dataSend.language === 'en') {
    return (result = ` <h3>Dear ${dataSend.patientName} </h3> 
    <p>You are receiving this email because you have successfully received an online medical appointment on DVNBooking</p>
    <p>Prescription information is sent in the attached file</p>
    <div>Thank you !!!</div>
  `)
  }
  return result
}

module.exports = {
  sendSimpleEmail,
  sendAttachments,
}
