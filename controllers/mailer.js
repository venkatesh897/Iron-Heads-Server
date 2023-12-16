import nodemailer from 'nodemailer'
import mailgen from 'mailgen'


let nodeconfig = {
    host: "smtp.ethereal.email",
    port: 587,
    SMTPAuth : true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "francisco58@ethereal.email",
    pass: "26agFFEpvMUsBJYKUv",
  },
}

let transpoter = nodemailer.createTransport(nodeconfig);

let mailgenerator = new mailgen({
    theme:"default",
    product:{
        name:"mailgen",
        link:'https://mailgen.js/'
    }
})

 const registermail = async (req,res)=>
{
    const {username,userEmail,text,subject} = req.body

    var email = {
        body:{
            name:username,
            intro:text,
            outro:"df"

        }
        
    }

    var emailbody = mailgenerator.generate(email)

    let message = {
        from:"raegan.anderson10@ethereal.email",
        to:userEmail,
        subject:subject,
        html:emailbody
    }

    transpoter.sendMail(message).then(()=>
    {
        res.status(200).send({msg:"you should an email for otp"})
    }).catch(err => res.status(500).send({err}))
} 

export default registermail