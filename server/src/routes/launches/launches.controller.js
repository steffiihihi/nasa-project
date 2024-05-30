const {getAllLaunches,
        deleteLaunch,
        scheduleNewLaunchFunction
}=require('../../models/launches.model')

const {getPagination}=require('../../services/query')

async function httpGetAllLaunches(req,res){
    const {skip,limit}=getPagination(req.query)
    return res.status(200).json(await getAllLaunches(skip,limit))
}

async function httpAddNewLaunch(req,res){
    const launch=req.body

    if(!launch.launchDate || !launch.mission || !launch.rocket || !launch.target){
        return res.status(400).json({
            error: "Incomoplete Information!"
        })
    }
    launch.launchDate=new Date(launch.launchDate)
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: 'Invalid Date!'
        })
    }

    await scheduleNewLaunchFunction(launch)
    return res.status(201).json(launch)
}

async function httpDeleteLaunch(req,res){
    const flightNumber=Number(req.params.id);
    const launchExistss=await deleteLaunch(flightNumber)

    if(!launchExistss){
        return res.status(400).json({
            error: 'No such launch exists!'
        })
    }

    return res.status(200).json(launchExistss.modifiedCount===1)
}

module.exports={
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeleteLaunch
}