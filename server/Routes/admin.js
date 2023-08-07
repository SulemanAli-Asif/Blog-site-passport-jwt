const express = require('express');
const router = express.Router();
const Post=require('../model/Schema');
const User=require('../model/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


const adminLayout='../views/layouts/admin'
const secret=process.env.secret;

const authMiddleware = (req,res,next)=>{
    const token =req.cookies.token;

    if(!token)
    {
        return res.status(401).json({msg:'Unauthorized'});
    }
    try{
        const decoded=jwt.verify(token,secret);
        req.userId = decoded.userId;
        next();
    }
    catch(err)
    {
        res.status(401).json({msg:'Unauthorized'})
    }

}

//getting the admin Sign in Page

router.get('/admin',async(req,res)=>{
try{

    const locals={
        title:"Admin",
        description:"Admin Panel For the Blog"
    }

    res.render('admin/index',{locals,layout:adminLayout});


}
catch(err)
{
    console.log(err);
}

})

//Signing the User

router.post('/admin',async(req,res)=>{
    try{
        const {name,password}=req.body;

        const user=await User.findOne({name});

        if(!user)
        {
            return res.status(401).json({msg:"Invalid Credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid)
        {
            return res.status(401).json({msg:"Invalid Credentials"});
        }

        const token=jwt.sign({userId:user._id},secret);
        res.cookie('token',token,{httpOnly:true});
        
        res.redirect('/dashboard');


        res.redirect('admin')
    }
    catch(err){
        console.log(err)
    }
})

//Logging Out the user

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
  });



router.get('/dashboard',authMiddleware,async(req,res)=>{

    try{
        const locals={
            title:'dashboard',
            description:'A node based blog site'
        }
        const data=await Post.find();
        res.render('admin/dashboard',{
            locals,data,layout:adminLayout
        });

    }
    catch(err)
    {
        console.log(err);
    }

})

//Optional Register Section

router.post('/register',async(req,res)=>{
    try{
        const {name,password}=req.body;
        const hashedPassword=await bcrypt.hash(password, 10);

        console.log({name,password:hashedPassword});

        try {
            const user = await User.create({ name, password:hashedPassword });
            res.status(201).json({ message: 'User Created', user });
          }
        catch(err)
        {
            if(err.code===11000)
            {
                res.status(400).json({msg:"Data already in use"});
            }
            console.log(err)
            res.status(500).json({msg:"Internal Server error"})
        }

     }
    catch(err){
        console.log(err)
    }
})

//Adding A Post Get-route

router.get('/add-post',authMiddleware,async(req,res)=>{

    try{
        const locals={
            title:'Add-Post',
            description:'A node based blog site'
        }
        const data=await Post.find();
        res.render('admin/add-post',{
            locals,data,layout:adminLayout
        });

    }
    catch(err)
    {
        console.log(err);
    }

})



//Adding A Post Post-route

router.post('/add-post',authMiddleware,async(req,res)=>{

    try{

       try{ 
        const newPost=new Post({
            title:req.body.title,
            body:req.body.body
        });
    
        await Post.create(newPost)
        res.redirect('/dashboard')
    }
    catch(err)
    {
        console.log(err)
    }
       

    }  
      
    catch(err)
    {
        console.log(err);
    }

})

//Edit a Post Put-route

router.put('/edit-post/:id',authMiddleware,async(req,res)=>{

    try{

        await Post.findByIdAndUpdate(req.params.id,{
            title:req.body.title,
            body:req.body.body,
            updatedAt:Date.now()
        })
       

        res.redirect(`/edit-post/${req.params.id}`)
    }  
      
    catch(err)
    {
        console.log(err);
    }

})

//Edit a Post Get-ROute

router.get('/edit-post/:id',authMiddleware,async(req,res)=>{

    try{

       const data=await Post.findById({_id:req.params.id})
        
       

        res.render('admin/edit-post',{
            data,
            layout:adminLayout
        })
    }  
      
    catch(err)
    {
        console.log(err);
    }

})

//Delet A Post

router.delete('/delete-post/:id',async (req,res)=>{

try {  
      await Post.findByIdAndDelete(req.params.id);
      res.redirect('/dashboard')
}  

catch(err){
    console.log(err)
}
})


module.exports=router;