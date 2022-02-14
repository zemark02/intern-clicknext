const User = require("../models/User");
//@desc create user
//@route Post /register
//@access Public
exports.register = async (req, res, next) => {
  try {
    const { firstname, lastname, username, password } = req.body;

    const user = await User.create({
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
    });
    // const token = user.getSignedJwtToken()
    // res.status(200).json({ success: true , token:token });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false,message:"Cannot create user" });
  }
};

//@desc login
//@route Get /login
//@access Public
exports.loginPage = (req,res,next)=>{
  res.status(200).render("login",{data:{success:true}});
}

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).render("login",{data:{success:false,message:"Please provide username and password"}});
  }

  const user = await User.findOne({ username: username }).select("+password");
  console.log(user);

  if (!user) {
    return res.status(400).render("login",{data:{success:false,message:"Invalid username or password"}});
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(400).render("login",{data:{success:false,message:"Invalid username or password"}});
  }


  sendTokenResponse(user, 200, res,req,next);
};

exports.logout = async (req,res,next)=>{
  try{
    res.clearCookie("token");
    res.status(200).redirect("/login")
  }catch(err){
    console.log(err.stack);
    res.status(500).json({success:false,message:"Cannot logout"})
  }
}

const sendTokenResponse = (user, statusCode, res , req ,next) => {
  const token = user.getSignedJwtToken();

  const options = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
  res.render("linktohomepage" , {data:{success:true}})
};

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};
