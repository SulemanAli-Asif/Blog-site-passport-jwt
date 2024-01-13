const Post=require('../server/model/Schema');
const User = require('../server/model/User')
exports.homeRoute=async (req,res)=>{
    try{
        const locals={
            title:"Blog",
            description:"A blog Website using Node.js, Express and MongoDB."
        }
        let perPage=10;
        let page=req.query.page||1;

        const data=await Post.aggregate([{$sort :{createdAt:1}}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const user = req.user; 
        const count = await Post.count();
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <=Math.ceil(count/perPage);

        res.render('index',{
            locals,
            data,
            current:page,
            user,
            nextPage:hasNextPage?nextPage:null
        });

    }
    catch(err){
        console.log(err);
    }

}


exports.getPosts = async (req,res)=>{
    try{
        user=req.user;
        let slug=req.params.id;
        const data=await Post.findById({_id:slug})
        const locals={
            title:data.title,
        }
        res.render('post',{user,locals,data})
    }
    catch(err){
        console.log(err);
    }
}

exports.searchPosts = async (req,res)=>{
    try{
        const locals={
            title:"Search",
            description:"A blog Website using Node.js, Express and MongoDB."
        }

        let searchTerm=req.body.searchTerm;
        const seachNoSpecialChar=searchTerm.replace(/[^a-zA-Z0-9]/g,"");

        const data=await Post.find({
            $or:[
                {title:{$regex: new RegExp(seachNoSpecialChar,'i')}},
                {body:{$regex: new RegExp(seachNoSpecialChar,'i')}}
            ]
        })


        res.render('search',{
            data,locals
        });
    }
    catch(err){
        console.log(err)
    }
}

exports.getAbout = (req,res)=>{
    const locals={
        title:"Blog",
        description:"A blog Website using Node.js, Express and MongoDB."
    }
    res.render('about',{locals});
}

exports.getContact = (req,res )=>{
    const locals={
        title:"Contact",
        description:"A blog Website using Node.js, Express and MongoDB."
    }

    res.render('contact',{locals})
}