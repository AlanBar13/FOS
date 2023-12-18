import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs';
import { UserInput } from "../db/models/User";
import { getAllUsers, createUser, getUserById, deleteUserById, getUserByUsername } from '../services/user.service';
import generateToken from "../utils/generateJWTToken";
import { JWTUser, CustomRequest } from "../types";
import { UserRoles } from "../constants";


export const getUsers = asyncHandler(async (req: CustomRequest, res: Response) => {
    const authUser = req.user;
    if (!authUser){
        res.status(401);
        throw new Error(`Not authorized, not authenticated`);
    }

    if (authUser.role === UserRoles.admin || authUser.role === UserRoles.dev){
        const users = await getAllUsers();

        res.json(users)
    }else{
        res.status(401);
        throw new Error(`User lacks permission`);
    }
})

export const registerUser = asyncHandler(async (req: CustomRequest, res: Response) => {
    const authUser = req.user;
    if (!authUser){
        res.status(401);
        throw new Error(`Not authorized, not authenticated`);
    }

    //Only devs or admin can create new users
    if (authUser.role === UserRoles.admin || authUser.role === UserRoles.dev){
        const payload: UserInput = req.body;

        //TODO: Set User creation guidelines
        //TODO: send errors if username or password doesnt follow guidelines
        const user = await createUser(payload);

        if (user){
            res.json(user);
        }else{
            throw new Error(`Could not create the user`);
        }
    }else{
        res.status(401);
        throw new Error(`User lacks permission`);
    }
})

export const getUser = asyncHandler(async (req: CustomRequest, res: Response) => {
    const authUser = req.user;
    if (!authUser){
        res.status(401);
        throw new Error(`Not authorized, not authenticated`);
    }

    if (authUser.role === UserRoles.admin || authUser.role === UserRoles.dev){
        const id = Number(req.params.id);

        const user = await getUserById(id);

        res.json(user)
    }else{
        res.status(401);
        throw new Error(`User lacks permission`);
    }
})

export const deleteUser = asyncHandler(async (req: CustomRequest, res: Response) => {
    const authUser = req.user;
    if (!authUser){
        res.status(401);
        throw new Error(`Not authorized, not authenticated`);
    }

    if (authUser.role === UserRoles.admin || authUser.role === UserRoles.dev){
        const id = Number(req.params.id);

        const deleted = await deleteUserById(id);

        if (deleted){
            res.json({"message": `User ${id} was deleted successfully`})
        }else{
            throw new Error(`Could not delete User ${id}`)
        }
    }else{
        res.status(401);
        throw new Error(`User lacks permission`);
    }
})

export const authUser = asyncHandler(async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = await getUserByUsername(username, false);
    if (user && (await bcrypt.compare(password, user.password))){
        const fetchedUser: JWTUser = {
            id: user.id,
            username: user.username,
            role: user.role
        }
        res.json({
            token: generateToken(fetchedUser),
            role: fetchedUser.role
        })
    }else {
        res.status(401);
        throw new Error('Wrong password');
    }
})