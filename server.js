import express from "express"
import cors from "cors"
import morgan from "morgan"
import connect from "./Database/connection.js"
import router from "./router/route.js"

const app = express()


app.use(cors())
app.use(morgan())
app.disable('x-powered-by')
app.use(express.json())


const port = 8000


app.get('/',(req,res)=>
{
    res.status(201).json("Home Get Request")
})

app.use('/api',router)

connect().then(()=>
{
    try{
        app.listen(port,()=>
        {
            console.log("server connected")
        })
    }
    catch(error)
    {
        console.log("error connecting database")
    }
}).catch((error)=>
{
    console.log("invalid database connection")
})
