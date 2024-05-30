const path=require('path')
const fs=require('fs')

const {parse}=require('csv-parse')

const planets=require('./planets.mongo')

function isHabitable(planet){
    return planet['koi_disposition']==='CONFIRMED' && planet['koi_insol']>0.36 && planet['koi_insol']<1.11 && planet['koi_prad']<1.6
}

function getPlanetsData(){
    return new Promise((resolve , reject)=>{
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data',(data)=>{
            if(isHabitable(data)){
                savePlanet(data)
            }
        })
        .on('error',(err)=>{
            console.log(err)
            reject(err)
        })
        .on('end',async ()=>{
            const countPlanetLength=(await getAllPlanets()).length
            console.log(`Total ${countPlanetLength} planets found!`)
            console.log('Done!')
            resolve()
        })
    })
}

async function savePlanet(planet){
    try{
        await planets.updateOne({ 
            keplerName: planet.kepler_name
        },{
            keplerName: planet.kepler_name
        },{
            upsert:true
        }) 
    }catch(err){
        console.error(err)
    }
    
}

async function getAllPlanets(){
    return await planets.find({},{
        '__v':0, '_id':0
    })
}

module.exports={
    getPlanetsData,
    getAllPlanets,
}