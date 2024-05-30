const express=require('express')

const {httpGetAllLaunches,
    httpDeleteLaunch,
    httpAddNewLaunch
}=require('./launches.controller')

const launchesRouter=express.Router()

launchesRouter.get('/',httpGetAllLaunches)
launchesRouter.post('/',httpAddNewLaunch)
launchesRouter.delete('/:id',httpDeleteLaunch)

module.exports=launchesRouter