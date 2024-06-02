const mongoose=require('mongoose')

const MONGO_URL=process.env.MONGO_URL

mongoose.connection.once('open',()=>{
    console.log('Connection Established!')
})

mongoose.connection.on('error',(err)=>{
    console.error(err)
})

async function mongooseConnect(){
    mongoose.connect(MONGO_URL)
}

async function mongooseDisconnect(){
    mongoose.disconnect(MONGO_URL)
}

module.exports={
    mongooseConnect,
    mongooseDisconnect
}