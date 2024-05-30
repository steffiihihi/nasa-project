const axios=require('axios')

const launchesDataBase=require('./launches.mongo')
const planets=require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER=100;

async function populateLaunches(){
    const response=await axios.post('https://api.spacexdata.com/v4/launches/query',{
        query:{},
        options:{
            pagination:false,
            populate:[
                {
                path:"rocket",
                select:{
                    name:1
                }
                },
                {
                    path:'payloads',
                    select:{
                        name:1
                    }
                }
            ]
        }
    })

    const launchDocs=response.data.docs
    for(const launchDoc of launchDocs){
        const payloads=launchDoc['payloads']
        const customers=payloads.flatMap((payload)=>{
            return payload['customers']
        })
        const launch={
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'], 
            customers: customers
        }
        console.log(launch.flightNumber+" "+launch.misson)

        await saveLaunch(launch)
    }
}

async function getLaunchesData(){

    console.log('Launches Data loaded successfuly??')

    const lExists=await findLaunch({
        flightNumber:1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
        
    })

    if(lExists){
        console.log('Data already loaded!')
    }else{
        await populateLaunches()
    }
}

async function getAllLaunches(skip,limit){
    return await launchesDataBase.find({},{'_id':0,'__v':0}).sort({flightNumber:1}).skip(skip).limit(limit)
}

async function saveLaunch(launch){
    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    },
    launch,
    {
        upsert: true
    }
)}
async function getLatestFlightNumber(){
    const latestLaunch=await launchesDataBase.findOne({}).sort('-flightNumber')
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}
async function scheduleNewLaunchFunction(launch){
    const planet=await planets.findOne({
        keplerName: launch.target
    })

    if(!planet){
        throw new Error('No matching Planet found!')
    }
    const latestFlightNumber=await getLatestFlightNumber()+1
    const newLaunch=Object.assign(launch,{
        success:true,
        upcoming:true,
        customers: ['ZTM', 'NASA'],
        flightNumber: latestFlightNumber
    })

    await saveLaunch(newLaunch)
}

async function findLaunch(filter){
    const a=await launchesDataBase.findOne(filter)
    console.log(a)
    return a
}

async function launchExists(flightId){
    return findLaunch({
        flightNumber: flightId
    })
}
async function deleteLaunch(flightNumberr){
    if(! await launchExists(flightNumberr)){
        return {
            err: "Launch not Found!",
        }
    }

    return await launchesDataBase.updateOne({
        flightNumber: flightNumberr
    },{
        upcoming: false,
        success: false
    })
}

module.exports={
    getLaunchesData,
    getAllLaunches,
    deleteLaunch,
    scheduleNewLaunchFunction
}