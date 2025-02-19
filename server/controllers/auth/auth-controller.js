import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import handleError from "../../utils/error.js";
const secretKey = process.env.SECRETKEY;
class AuthController {
  // function for handling registeration.
  static async authRegister(req, res, next) {
    const { userName, email, password } = req.body;
    try {
      // or operator return a user matched with either of username or email
      const checkUser = await User.findOne({
        $or: [{ userName }, { email }],
      });

      if (checkUser) {
        // return res.json({
        //     success:false,
        //     message:"Either username or email is alreay used please try another one."
        // })
        return next(
          handleError(
            409,
            "Either username or email is alreay used please try another one."
          )
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        userName,
        email,
        password: hashedPassword,
      });
      res.status(201).json({
        success: true,
        message: "Registration successful",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // function to handle login functionality
  static async authLogin(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return next(handleError(404, "Either email or password do not match"));
      }
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return next(handleError(404, "Credentials do not match"));
      }
      // create token
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email,
          userName:user.userName
        },
        secretKey,
        { expiresIn: "60m" }
      );

      // extract user info excluding the password
      // const { password: pas, ...rest } = user._doc;

      // sending cookie with response
      res
        // .cookie("token", token, { httpOnly: true, secure: false })
        .cookie("token", token)
        .status(200)
        .json({
          success: true,
          message: "Logged in successfully",
          user: {id: user._id,
          role: user.role,
          email: user.email,
          userName:user.userName},
        });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // function to verify user authentication
  static async authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return next(handleError(401, "Unathorized user"));

    try {
      jwt.verify(token, secretKey, (err, user) => {
        if (err) return next(handleError(401, "Unathorized user"));
        res
          .status(200)
          .json({ success: true, message: "Authenticated user", user });
        next();
      });

      // const decoded = jwt.verify(token, secretKey);
      // req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  }

  // logout function
  static async authLogout(req, res) {
    try {
      // Clear the cookie
      res.clearCookie("token");

      // Send a successful response
      res.status(200).json({success:true, message: "Logged out successfully" });
    } catch (error) {
      next(error); // Pass any error to the error-handling middleware
    }
  }
}

export default AuthController;
