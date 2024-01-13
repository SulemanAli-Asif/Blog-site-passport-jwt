const express = require("express");
const router = express.Router();
const Post = require("../model/Schema");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const adminLayout = "../views/layouts/admin";
const secret = process.env.secret;
//authorization middleware

//authcheck
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send(
    "<script>alert('Please log in first'); window.location='/';</script>"
  );
};

// //Logging Out the user

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.redirect("/");
    }
    res.redirect("/");
  });
});

//route for getting the dashboard
router.get("/dashboard", authCheck, async (req, res) => {
  try {
    const locals = {
      title: "dashboard",
      description: "A node based blog site",
    };
    const data = await Post.find({ userId: req.user._id });
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

//auth with the google+

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

//google redirect

router.get(
  "/auth/google/redirect",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const data = Post.find();
    res.redirect("/dashboard");
  }
);

//Adding A Post Get-route

router.get("/add-post", authCheck, async (req, res) => {
  try {
    const locals = {
      title: "Add-Post",
      description: "A node based blog site",
      userId: req.user._id,
    };
    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

//Adding A Post Post-route

router.post("/add-post", authCheck, async (req, res) => {
  try { 
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        userId: req.user._id,
      });

      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
    }  
  } catch (err) {
    console.log(err);
  }
});

//Edit a Post Put-route

router.put("/edit-post/:id", authCheck, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
});

//Edit a Post Get-ROute

router.get("/edit-post/:id", authCheck, async (req, res) => {
  try {
    const data = await Post.findById({ _id: req.params.id });

    res.render("admin/edit-post", {
      data,
      layout: adminLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

//Delet A Post

router.delete("/delete-post/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
