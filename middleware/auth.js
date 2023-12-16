import Jwt from "jsonwebtoken";

export default async function Auth(req,res,next)
{
    try{

        const token = req.headers.authorization.split(" ")[1];

        //retrive user details

        const decodetoken = await Jwt.verify(token, 'secret')

        req.user = decodetoken

        res.json(decodetoken)

    }
    catch(err)
    {
        res.status(401).send({err:"Authentication failed"})
    }
}

export function localVariable(req,res,next)
{
    res.app.locals = {
        OTP:null,
        resetSession:false
    }
    next()
}