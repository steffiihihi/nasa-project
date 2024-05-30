const http=require('http')

require('dotenv').config() 

const {mongooseConnect}=require('./services/mongo')

const PORT=process.env.PORT || 8000

const app=require('./app')
const {getPlanetsData}=require('./models/planets.model')
const {getLaunchesData}=require('./models/launches.model')

const server=http.createServer(app)

async function startServer(){
    await mongooseConnect()

    await getPlanetsData()

    await getLaunchesData()

    server.listen(PORT,()=>{
        console.log("Running on port... : "+PORT)
    })
}

startServer()