import userModle from "../model/user.modle.js"
import bcrypt, { compareSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'


//middleware to verify user

export async function verifyUser(req,res,next)
{
    try{
        const {username} = req.method == 'GET'?req.query : req.body;
  

        //check the user exist
        let exist = await userModle.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();
        

     
        

    }
    catch(err)
    {
        res.status(404).send({err:"Authentication error"})
    }
}


export async function register(req,res)
{
    
    try{

        const {username,password,email,profile,Weight} = req.body

        // const existUsername = userModle.findOne({username}).then((user) =>
        // {
        //     try{
        //         if(user)
        //         {
        //             res.status(201).send({msg:"user Exist"})
        //         }
        //     }
        //     catch(err)
        //     {
        //         res.status(500).send(err)
        //     }
            
        // })

        

        // const existEmail = userModle.findOne({email}).then((user) =>
        // {
        //     try{
        //         if(user)
        //         {
        //             return res.status(201).send({msg:"email Exist"})
        //         }
        //     }
        //     catch(err)
        //     {
        //         return res.status(500).send(err)
        //     }
            
        
        // })

        const existUsername = new Promise((resolve, reject) => {
            userModle.findOne({ username }).then((user)=>{
                if(user){
                    reject("Please use unique username")
                }
                
                resolve()
            })
        });

        const existEmail = new Promise((resolve, reject) => {
            userModle.findOne({ email }).then((user)=>{
                if(user){
                    reject( "Please use unique Email")
                }
                
                resolve()
                
            })
        });




        Promise.all([existUsername,existEmail]).then(()=>
        {
            if(password)
            {
                bcrypt.hash(password,10).then((hashpassword)=>
                {
                    const user = new userModle({
                        username,
                        password:hashpassword,
                        profile:profile||'',
                        email:email,
                        Weight:Weight
                    })

                   user.save().then((result)=>
                   {
                    res.status(201).send({msg:"user registred sucessfully"})

                   }).catch(err=>
                    {
                        res.status(500).send({err})
                    })

                }).catch((err)=>
                {
                    res.status(500).send({err:"Unable to Hash password"})
                })
            }
        }).catch((err)=>
        {
            res.status(500).send({err})
        })

    }
    catch(error){
        res.send(201).send({error})
    }
   
}


export async function login(req,res)
{
   const {username,password} = req.body
   try{

    userModle.findOne({username}).then(user => {
        
        bcrypt.compare(password, user.password).then(passwordCheck => {
            if(!passwordCheck)
            {
                return res.status(400).send({err:"does not have password"})
            }
            
            const token = jwt.sign({
                userId:user._id,
                username:user.username
            }, 'secret', {expiresIn:"24h"})
            console.log(token)

            return res.status(200).send({msg:"login sucessfull", username:user.username,token})


        }).catch(err=> res.status.send({err:"password does not match"}))
    }).catch(err=> res.status(404).send({err:"User name not found"}))

   }
   catch(err)
   {
    res.status(500).send({err})
   }
}

export async function getUser(req,res)
{
    const {username} = req.params

    try{

        if(!username)
        {
            return res.status(500).send({err:"Invalid user name"})
        }

        userModle.findOne({username}).then((user) =>
        {
            if(!user)
            {
                return res.status(501).send({err:"user not found"})
            }

            const {password,...rest} = Object.assign({}, user.toJSON())

            return res.status(201).send(rest)

        }).catch((err)=>
        {
            console.log(err)
            res.status(500).send({err})
        })

    }catch(err)
    {
        res.status(404).send({err:"Cannot find user data"})
    }
}


export async function getWorkSessions(req,res)
{
    const {username} = req.params
    try{
        if(!username)
        {
            res.status(500).send({err:"Invalid user name"})
        }
        userModle.findOne({username}).then(user=>
        {
            if(!user)
            {
                return res.status(501).send({err:"user not found"})
            }
            const {password,...rest} = Object.assign({}, user.toJSON())
            return res.status(201).send(rest)

        })
    }
    catch(err)
    {
        res.status(404).send({err:"Invalid user name"}).then((user)=>
        {

        })
    }
    
}


export async function updateUser(req,res)
{
   try{

    const { userId } = req.user;
    console.log(userId)

    if(userId)
    {
        const body = req.body
        

        userModle.updateOne({_id:userId},body).then(data =>
            {
        
                return res.status(201).send('Updated the profile')

            }).catch(err => res.status(500).send({err}))
    }
    else{
        res.status(401).send({err:"user not fouund"})
    }

   }
   catch(err)
   {
    res.status(401).send({err:"Invalid user name"})
   }
}


export async function generateOTP(req,res)
{
    req.app.locals.OTP = await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
    res.status(201).send({code:req.app.locals.OTP})

}

export async function verifyOTP(req,res)
{
    const {code} = req.query;

    if(parseInt(req.app.locals.OTP) === parseInt(code))
    {
        req.app.locals.OTP = null
        req.app.locals.resetSession = true
        return res.status(201).send({msg:"verifid sucessfully"})
    }
    else{
        res.status(400).send({err:"Invalid OTP"})
    }
}


export async function createResetSession(req,res)
{
    if(req.app.locals.resetSession )
    {
         

        return res.status(500).send({flag:req.app.locals.resetSession})
    }
    return res.status(400).send({msg:"session expired"})
}




export async function resetPassword(req,res)
{
    if(!req.app.locals.resetSession)
    {
        return res.status(400).send({msg:"session expired"})
    }
    try{

        const{username,password} = req.body;

        try{
            userModle.findOne({username}).then(user=>
                {
                    bcrypt.hash(password,10).then(hashpassword => {
                        userModle.updateOne({username:user.username},{password:hashpassword}).then(data =>{
                            req.app.locals.resetSession = false
                            res.status(201).send({msd:"password changed succesffuly"
                        })} ).catch(err => res.send(404).semd({err}))
                    }).catch(err => res.status(404).send({err:"unable to hash password"}))
                }).catch(err => res.status(404).send({err:"username not found"}))

        }
        catch(err)
        {
            res.status(400).send({err})
        }

    }
    catch(err)
    {
        return res.satus(400).send({err})
    }
}