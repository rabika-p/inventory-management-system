import * as UserRepository from "../Repository";
import {IUser } from "../Repository/User.types";
import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";

//to import JSON web token for authentication
const jwt = require("jsonwebtoken");

//Code for user onboarding process

export const createAuthenticatedUser = async (user: IUser) => {
  try {
    return await UserRepository.createAuthenticatedUser(user);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (user: IUser) => {
  try {
    //checkAuth returns login message, accessToken and role of the user that is trying to log in
    const checkAuth = await UserRepository.login(user);
    if (checkAuth?.success) {
      const accessToken = jwt.sign(checkAuth, process.env.ACCESS_TOKEN_SECRET);
      const response = {
        message: checkAuth.message,
        accessToken: accessToken,
        role: checkAuth.role,
        userId: checkAuth.user_id,    
        username: checkAuth.username
      };

      return response;  
    } 
    else if (checkAuth?.isActive === false) {
      const err = {
        message: "Account is suspended! Please contact support",
        status: 401,
      };
      return { err };
    }
    else {
      const err = {
        message: "Login not successful",
        status: 401,
      };
      return { err };
    }
  } catch (error) {
    console.log(error);
  }
};

export const forgotPsw = async (user: IUser) => {
  try {
    const { email } = user;
    const checkUser = await UserRepository.forgotPsw(user);
    if (checkUser?.success) {
      // const resetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h' });
      const resetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET);

      const resetTokenLink = `http://localhost:5173/reset-password?token=${resetToken}`;

      if (email) {
        await sendResetEmail(email, resetTokenLink);
      }

      return { message: "Password reset email sent.", success: true };
    } else {
      const err = {
        message: "User account does not exist",
        status: 401,
      };
      return { err };
    }
  } catch (e) {
    console.error(e);
  }
};

export const resetPsw = async (password: any, decoded: any) => {
  try {
    const userEmail = decoded.email;

    const checkUser = await UserRepository.getUserByEmail(userEmail);

    if (checkUser) {
      const result = await UserRepository.resetPsw(userEmail, password);
      return { message: "Password has been reset successfuly", success: true };
    } 
    else {
      const err = {
        message: "Password reset unsucessful!",
        status: 401,
      };
      return { err };
    }
  } catch (e) {
    console.error(e);
  }
};

//send email with link to reset password
async function sendResetEmail(email: string, resetTokenLink: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PSW,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetTokenLink}`,
  };

  await transporter.sendMail(mailOptions);
}

export const getAllUsers = async () => {
  try {
    const users = await UserRepository.getAllUsers();

    return users;
  } catch (err) {
    console.log(err);
  }
};

export const updateUserAccountStatus = async (id: string) => {
  try{
    const users = await UserRepository.updateUserAccountStatus(id);
    return users;
  }
  catch (e) {
    console.log(e);
  }
};


// export const getAllRequestedProducts = async () => {
//   try {
//     const reqProducts = await UserRepository.getAllRequestedProducts();

//     return reqProducts;
//   } catch (e) {
//     console.log(e);
//   }
// };

// export const updateProductReqStatus = async (productId: string, updateData: any) => {
//   try{
//       return UserRepository.updateProductReqStatus(productId, updateData);
//   }
//   catch (e) {
//     console.log(e);
//   }
// };