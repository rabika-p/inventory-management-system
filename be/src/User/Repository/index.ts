import { ObjectId } from "mongodb";
import { IUser } from "./User.types";

const { MongoClient  } = require("mongodb");

const client = new MongoClient(process.env.URI);

const database = client.db("office-inventory-system");
const usersCollection = database.collection("users");
const rolesCollection = database.collection("roles");

const productsCollection = database.collection('products');


//Code for user onboarding process  
export async function connectToDatabase() {
  await client.connect();
  return client.db();
};

// export async function createAuthenticatedUser(user: IAuthenticatedUser) {

//   try{
//     const {firstname, lastname, email, password, username, role} = user;
//     const adminRole = await rolesCollection.findOne({"name": role});
//     const roleId = adminRole ? adminRole._id : null;

//     const userData = {
//       firstname,
//       lastname,
//       email,
//       username,
//       password,
//       role: roleId
//     };
//     const result = await usersCollection.insertOne(userData);

//     return "User created successfully.";
    
//   }
//   catch(error){
//     console.log(error);
//   }
// };

export async function createAuthenticatedUser(user: IUser) {
  try {
    const { firstname, lastname, username, password, position, email } = user;
    //assign role as user by default
    const userRole = await rolesCollection.findOne({ name: "USER" });
    //assign isActive to true by default
    const isActive = true;
    console.log(userRole);

    const userData: any = {
      firstname,
      lastname,
      username,
      password,
      position,
      is_active: isActive,
      email,
      role_id: userRole._id
    };

    // if (roleId) {
    //   userData.role = roleId;
    // }

    const result = await usersCollection.insertOne(userData);

    return {message: "User created successfully"};
  } catch (error) {
    console.log(error);
  }
}


export async function login(user: IUser) {
  try {
    const { username, password } = user;

    const userData = await usersCollection.findOne({ username });

    if (userData) {
      if (!userData.is_active) {
      // return { message: "Account is suspended. Please contact support.", isActive: false, success: false };
      return { isActive: false, success: false };
    }
  }

    if (userData && userData.username === username && userData.password === password) {
      if (userData.is_active) {
        const role = await rolesCollection.findOne({ name: 'ADMIN' });
        const roleId = userData.role_id;
        const userId = userData._id;
        const username = userData.username;

        if (role && roleId.toString() === role._id.toString()) {
          return { message: "Admin logged in successfully", success: true, role: role.name, username: username };
        } else {
          return {
            message: "User logged in successfully",
            success: true,
            role: 'USER',
            user_id: userId,
            username: username
          };
        }
      } 
    
    } 
    else {
      // return { message: "Unauthorized login.", success: false };
      return {success: false };
    }
  } catch (e) {
    console.error(e);
  }
}


export async function forgotPsw(user: IUser) {
  try{
    const {email} = user;
    const userData = await usersCollection.findOne({email});
    if (userData && userData.email === email){
      return { message: "User account exists", success: true };
    }
    else{
      return { message: "User account does not exist", success: false };
    }
    
  }
  catch(e){
    console.log(e);
  }
};

export async function resetPsw(email:string, password:string) {
  try{
    const userData = await usersCollection.findOne({email});
    if (userData){

      await usersCollection.updateOne({ email }, { $set: { password: password } });
      return { message: "Password reset successful", success: true };
    }
    else{
      return { message: "User not found!", success: false };
    }
    
  }
  catch(e){
    console.log(e);
  }
};

export async function getUserByEmail(email:string) {
  const userData = await usersCollection.findOne({email});
  return userData;
}

//functions for employee view and actions on admin side
export async function getAllUsers() {
  try {
    //get all users except admin 
    const users = await usersCollection.find({ position: { $ne: "Admin" } }).toArray();
    return users;
  } 
  catch (e) {
    console.log(e);
  }
}

export const updateUserAccountStatus = async (id: string) => {
  try {
    const filter = ({_id: new ObjectId(id) });

    const user = await usersCollection.findOne(filter);

    if (!user) {
      return null;
    }

    const currentIsActive = user.is_active;

    const update = { $set: {"is_active": !currentIsActive} }; //fix this

    const result = await usersCollection.updateOne(filter, update);

    return result;
  } 
  catch (error) {
    console.log(error);
  }
};