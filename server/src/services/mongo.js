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

module.exports={
    mongooseConnect
}