import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

const createToken = (user, type = "access") => {
  const secret =
    type === "access"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;
  const expiresIn =
    type === "access"
      ? process.env.ACCESS_TOKEN_EXPIRY
      : process.env.REFRESH_TOKEN_EXPIRY;
  return jwt.sign({ userId: user._id }, secret, { expiresIn });
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, fullname, username } = req.body;
    if (!email || !password || !fullname || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      email,
      password,
      fullname,
      username,
      avatar: "https://www.gravatar.com/avatar",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = createToken(user, "access");
    const refreshToken = createToken(user, "refresh");

    const loggedInUser = await User.findById(user?._id).select(
      "-password -refreshToken"
    );

    loggedInUser.refreshToken = refreshToken;

    await loggedInUser.save({ validateBeforeSave: false });

    const userWithoutRefreshToken = await User.findById(user?._id).select(
      "-refreshToken -password"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Login successful",
        user: userWithoutRefreshToken,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const tokenFromHeaders = req.headers.accesstoken;
    const tokenFromCookies = req.cookies.accessToken;

    // console.log("c",tokenFromCookies);
    // console.log("h",tokenFromHeaders);

    if (!tokenFromHeaders || !tokenFromCookies) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing tokens",
      });
    }

    const decodedHeaderToken = jwt.verify(
      tokenFromHeaders,
      process.env.ACCESS_TOKEN_SECRET
    );
    const decodedCookieToken = jwt.verify(
      tokenFromCookies,
      process.env.ACCESS_TOKEN_SECRET
    );

    // console.log("c",decodedCookieToken?.userId);
    // console.log("h",decodedHeaderToken?.userId);

    if (decodedHeaderToken.userId !== decodedCookieToken.userId) {
      return res.status(403).json({ message: "Tokens do not match" });
    }

    await User.findByIdAndUpdate(
      decodedHeaderToken.userId,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    );

    // Clear cookies
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded?.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("u", user?.refreshToken);
    console.log("r", refreshToken);

    if (user?.refreshToken === refreshToken) {
      const accessToken = createToken(user, "access");
      const refreshToken = createToken(user, "refresh");

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          success: true,
          message: "Access token generated",
          accessToken,
          refreshToken,
        });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const token = req.headers.token;

    // console.log(token);

    if (!token) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.userId).select("-password -refreshToken");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User verified",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
