const mongoose=require('mongoose');

const connectDb=async (url)=>{
    mongoose.set('strictQuery',false);
    const connect=await mongoose.connect(url,{
        serverSelectionTimeoutMS: 5000, // Set a timeout for server selection
        socketTimeoutMS: 45000, // Set a timeout for socket connection
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("Connection Successful");
    })
    .catch((err)=>{
        console.log(err);
    })
}

module.exports={connectDb};