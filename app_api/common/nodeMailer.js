import nodemailer from 'nodemailer'
export default class NodeMailer {
  constructor (config) {
    this.cn = null
    this.tr = null
  }

  connect () {
    this.createConnection()
    this.createTransporter()
  }

  createConnection () {
    this.cn = {
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'innova.prosystem.45', // innova.7894561236@gmail.com
        pass: 'I1234567i.'
      },
      logger: true
    }
  }

  createTransporter () {
    this.tr = nodemailer.createTransport(this.cn)
  }

// -----------------------------------------------------------------------------------
//  MENSAJE PARA ENVIO DEL CODIGO PARA ACTIVAR CUENTA
//  ----------------------------------------------------------------------------------
  sendMailRegistry (user) {
    let tt = '<table style="table-layout:fixed" bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" width="100%">'
    tt += '<tr>'
    tt += '<td style="height:25;"></td>'
    tt += '</tr>'
    tt += '<tr><td>'
    tt += '<table bgcolor="#D8D8D8"  border="0" cellpadding="0" cellspacing="0" width="600">'

    tt += '<tr style="height:25px;">'
    tt += '<td style="width:10%;"></td>'
    tt += '<td style="width:80%;height:30px"></td>'
    tt += '<td style="width:10%;"></td>'
    tt += '</tr>'

    tt += '<tr>'
    tt += '<td></td>'
    tt += '<td align="center" valign="top">'
    tt += '<a href="http://innovaprosystem.com/account" target="_blank">'
    tt += '<img alt="Innova Prosystem" src="http://162.252.58.45/innova-movil/www/img/innova_logo.png" width="120"></a>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += 'Muchas Gracias por registrarse Sr(a), <b>' + user.description + '</b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b>Para Activar su cuenta de Usuario s&oacute;lo debes hacer click en el siguiente link:</b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td align="center" valign="center">'

    tt += '<a href="http://162.252.58.45:7000/#/activate-account/' + user.activate_code + '" target="_blank">'
    tt += '<b>Activa tu cuenta ya!</b>'
    tt += '</a>'

    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += 'Si Usted presenta alg&uacute;n inconveniente con la activaci&oacute;n de su registro escriba al siguiente correo <b>ventas@innovaprosystem.com</b> para ser atendido inmediatamente.'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '</table>'
    tt += '</td></tr>'
    tt += '</table>'

    var mailOptions = {
      from: '"Innova Accounting 👥 " <innova.prosystem.45@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Gracias por Registrarse ✔', // Subject line
      text: 'Innova Prosystem, Accounting', // plaintext body
      html: tt
    }

    this.send(mailOptions)
  }

// -----------------------------------------------------------------------------------
//  MENSAJE PARA ENVIO DEL CORREO DE VIENVENIDA
//  ----------------------------------------------------------------------------------

  sendMailWelcome (user) {
    // test
    let tt = '<table style="table-layout:fixed" bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" width="100%">'
    tt += '<tr>'
    tt += '<td style="height:25;"></td>'
    tt += '</tr>'
    tt += '<tr><td>'
    tt += '<table bgcolor="#D8D8D8"  border="0" cellpadding="0" cellspacing="0" width="600">'

    tt += '<tr style="height:25px;">'
    tt += '<td style="width:10%;"></td>'
    tt += '<td style="width:80%;height:30px"></td>'
    tt += '<td style="width:10%;"></td>'
    tt += '</tr>'

    tt += '<tr>'
    tt += '<td></td>'
    tt += '<td align="center" valign="top">'
    tt += '<a href="http://innovaprosystem.com/account" target="_blank">'
    tt += '<img alt="Innova Prosystem" src="http://162.252.58.45/innova-movil/www/img/innova_logo.png" width="120"></a>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += 'Muchas Gracias por Activar su cuenta Sr(a), <b>' + user.description + '</b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b>Para comenzar a utilizar la Contabilidad en la Nube haga click en entrar y coloque los datos de su cuenta.</b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td align="center" valign="center">'

    tt += '<a href="http://162.252.58.45:7000" target="_blank">'
    tt += '<b>Entrar</b>'
    tt += '</a>'

    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += 'Si Usted presenta alg&uacute;n inconveniente con la activaci&oacute;n de su registro escriba al siguiente correo <b>ventas@innovaprosystem.com</b> para ser atendido inmediatamente.'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '</table>'
    tt += '</td></tr>'
    tt += '</table>'

    var mailOptions = {
      from: '"Innova Accounting 👥 " <innova.prosystem.45@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Bienvenidos a la Contabilidad en la Nube ✔', // Subject line
      text: 'Innova Prosystem, Accounting', // plaintext body
      html: tt
    }
    this.send(mailOptions)
  }

  sendMailRecovery (user) {
    // test
    let tt = '<table style="table-layout:fixed" bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" width="100%">'
    tt += '<tr>'
    tt += '<td style="height:25;"></td>'
    tt += '</tr>'
    tt += '<tr><td>'
    tt += '<table bgcolor="#D8D8D8"  border="0" cellpadding="0" cellspacing="0" width="600">'

    tt += '<tr style="height:25px;">'
    tt += '<td style="width:10%;"></td>'
    tt += '<td style="width:80%;height:30px"></td>'
    tt += '<td style="width:10%;"></td>'
    tt += '</tr>'

    tt += '<tr>'
    tt += '<td></td>'
    tt += '<td align="center" valign="top">'
    tt += '<a href="http://innovaprosystem.com/account" target="_blank">'
    tt += '<img alt="Innova Prosystem" src="http://162.252.58.45/innova-movil/www/img/innova_logo.png" width="120"></a>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += 'Bienvenido de nuevo Sr(a), <b>' + user.description + '</b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b>Para comenzar a utilizar la Contabilidad en la Nube haga click en entrar y coloque los datos de su cuenta.</b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td align="center" valign="center">'

    tt += 'Su Password es: <b>' + user.password + '</b>'

    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td align="center" valign="center">'

    tt += '<a href="http://162.252.58.45:7000" target="_blank">'
    tt += '<b>Entrar</b>'
    tt += '</a>'

    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += 'Si Usted presenta alg&uacute;n inconveniente con la activaci&oacute;n de su registro escriba al siguiente correo <b>ventas@innovaprosystem.com</b> para ser atendido inmediatamente.'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '<tr style="height:35px;">'
    tt += '<td></td>'
    tt += '<td>'
    tt += '<b></b>'
    tt += '</td>'
    tt += '<td></td>'
    tt += '</tr>'

    tt += '</table>'
    tt += '</td></tr>'
    tt += '</table>'

    var mailOptions = {
      from: '"Innova Accounting 👥 " <innova.prosystem.45@gmail.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Reenvio de Clave ✔', // Subject line
      text: 'Innova Prosystem, Accounting', // plaintext body
      html: tt
    }

    this.send(mailOptions)
  }

  sendMailNews (user) {
    // test
  }

  send (mailOptions) {
    this.tr.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: ' + info.response)
    })
  }
}
