import { asyncHandler } from "../utils/asyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new APIerror(500, "Something went wrong while generating referesh and access token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new APIerror(400, "All fields are required")
  }

  let finalEmail = email;
  let finalRole = role;

  if (role === "staff") {
    if (!email.startsWith("staff")) {
      throw new APIerror(400, "Staff email must start with 'staff' (e.g., staff+name@example.com)");
    }
    finalRole = "staff";
  } else {
    if (email.startsWith("staff")) {
      throw new APIerror(400, "Customers cannot use emails starting with 'staff+'");
    }
    finalRole = "user";
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email: finalEmail }]
  })

  if (existedUser) {
    throw new APIerror(409, "User with email or username already exists")
  }

  const user = await User.create({
    username,
    email: finalEmail,
    password,
    role: finalRole
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new APIerror(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body

  if (!password || !email) {
    throw new APIerror(400, "password or email is required")
  }

  if (role === "staff") {
    if (!email.startsWith("staff")) {
      throw new APIerror(400, "Staff email must start with 'staff' (e.g., staffname@example.com)");
    }
  } else {
    if (email.startsWith("staff")) {
      throw new APIerror(400, "Customers cannot use emails starting with 'staff'");
    }
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new APIerror(404, "User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new APIerror(401, "Invalid user credentials")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export { registerUser, loginUser, logoutUser };