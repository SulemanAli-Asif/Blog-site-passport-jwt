const mongoose=require('mongoose');

const connectDb=async (url)=>{
    mongoose.set('strictQuery',false);
    const connect=await mongoose.connect(url,{
    }).then(()=>{
        console.log("Connection Successful");
    })
    .catch((err)=>{
        console.log(err);
    })
}

module.exports={connectDb};