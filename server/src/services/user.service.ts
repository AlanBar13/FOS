import { User } from "../db/models";
import { UserInput, UserOutput } from "../db/models/User";

/**
* Create User on DB
*
* @param payload - User attributes
* @returns User from DB
*/
export const createUser = async (payload: UserInput): Promise<UserOutput> => {
    const newUser = await User.create(payload, { fields: ['username', 'role', 'id'] });
    
    return newUser;
}

/**
* Get all Users from DB
*
* @param excludePassword - If true password will not be included (Default true)
* @returns Array of Users
*/
export const getAllUsers = async (excludePassword = true): Promise<UserOutput[]> => {
   if(excludePassword){
        const users = await User.findAll({
            attributes: { exclude: ['password']}
        });

        return users;
   }else {
    const users = await User.findAll();

    return users;
   }
}

/**
* Get User by User ID
*
* @param id - User ID
* @param excludePassword - If true password will not be included (Default true)
* @returns User from DB
*/
export const getUserById = async (id: number, excludePassword = true): Promise<UserOutput> => {
    if (excludePassword){
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            throw new Error(`User Not Found`)
        }

        return user;
    }else{
        const user = await User.findByPk(id);

        if (!user) {
            throw new Error(`User Not Found`)
        }

        return user;
    }
}

/**
* Update User by User ID
*
* @param id - User ID
* @param payload - User Attributes
* @returns User from DB
*/
export const updateUserById = async (id: number, payload: UserInput): Promise<UserOutput> => {
    const user = await User.findByPk(id);

    if (!user) {
        throw new Error(`User Not Found`)
    }

    const updatedUser = await user.update(payload);
    return updatedUser;
}

/**
* Delete User by User ID
*
* @param id - User ID
* @returns True if it was deleted correctly
*/
export const deleteUserById = async (id: number): Promise<boolean> => {
    const deletedCount = await User.destroy({ where: {id} });

    return !!deletedCount;
}

/**
* Get User by Username
*
* @param username - User username
* @param excludePassword - If true password will not be included (Default true)
* @returns User from DB
*/
export const getUserByUsername = async (username: string, excludePassword = true): Promise<UserOutput> => {
    if (excludePassword){
        const user = await User.findOne({ 
            where: { username }, 
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            throw new Error(`Wrong username`)
        }

        return user;
    }else{
        const user = await User.findOne({ 
            where: { username }
        });

        if (!user) {
            throw new Error(`Wrong username`)
        }

        return user;
    }
}