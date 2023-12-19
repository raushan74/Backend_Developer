import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


// generate access and refresh token

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // adding value to user
        user.refreshToken = refreshToken
        // saving refresh token to database
        // befor saving token it will ask for required field, so we hav set validateBeforeSave to false
        await user.save({ validateBeforeSave: false })
        // access token generated
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "ok",
    // });
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    // getting user details
    const { fullName, email, username, password } = req.body
    //console.log("email: ", email);
    // checking field is not empty
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // checking for existing user
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist")
    }

    // images local path
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(avatarLocalPath);
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    console.log(req.files);
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverImageLocalPath = req.files.coverimage[0].path
        console.log(coverImageLocalPath);
    }
    console.log(coverImageLocalPath);

    //check for avatar
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // if avatar not available
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // entry in database

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        // if coverImage url is present then add it otherwise keep it empty
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // chek if user is created or not
    const createdUser = await User.findById(user._id).
        // to remove password and refreshToken
        select("-password -refreshTokrn"
        )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    // sending response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

});


// login conttroller for user

const loginUser = asyncHandler(async (req, res) => {
    // get data from req body
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send this token in form of cookie

    const { email, username, password } = req.body

    if (!username || !emai) {
        throw new ApiError(400, "username or password is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    // if user not found
    if (!user) {
        throw new ApiError(404, "User doees not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // optional
    const loggedInUser = await User.findById(user._id).
        select("-password -refreshtoken")

    // sending cookie
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessTokrn", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken,
                    refreshToken
                },
                "User logged In successfully"
            )
        )

})


// logOut Controller for user

const logOutUser = asyncHandler(async (req, res) => {
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

    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

export {
    registerUser,
    loginUser,
    logOutUser
}