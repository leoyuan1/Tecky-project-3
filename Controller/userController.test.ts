import { Knex } from "knex";
import { UserService } from "../Service/userService";
import { UserController } from "./userController"
import { Request, Response} from "express";
import { userFormidablePromise } from "../util/formidable";
import { hashPassword } from "../util/bcrypt";
jest.mock('../util/formidable')
jest.mock('../util/bcrypt')

function createRequest(){
    return {
        body: {},
        params: {}
    } as unknown as Request
}

function createResponse() {
    const res = {};
    return {
      status: jest.fn((status: number) => res),
      json: jest.fn(() => null),
    } as unknown as Response;
  }

describe('userController', ()=>{
    let userController: UserController;
    let userService: UserService;
    let req: Request;
    let res: Response;
    beforeEach(()=>{
        userService = new UserService({} as Knex)
        userService.getUserByEmail = jest.fn(async (userEmail: string)=>{
            [{
                email:"123@gmail.com",
                password: "123",
                username: "icon",
                icon: ""
            }]
        })
        userService.getUserByUserName = jest.fn(async (userUsername: string)=>{
            [{
                email:"123@gmail.com",
                password: "123",
                username: "icon",
                icon: ""
            }]
        })
        userService.insertUser = jest.fn(async (userEmail: string, hashedPassword: string, userName: string, fileName: string)=>{
                [{
                    email:"123@gmail.com",
                    password: "123",
                    username: "icon",
                    icon: ""
                }]
        })
        userService.changePassword = jest.fn(async (userEmail: string, hashedPassword: string)=>{})
        req = createRequest();
        res = createResponse();
        (userFormidablePromise as jest.Mock).mockReturnValue({
            fields: {email: '123@gmail.com',username: "123", password: "123"},
            files: {image: {newFilename: 'yyy.jpeg'}}
        })
        (hashPassword as jest.Mock).mockReturnValue(123);
        userController = new UserController(userService);
        })
        it('can signup',async ()=>{
            await userController.signup(req,res);
            expect(userService.getUserByEmail).toBeCalledTimes(1);
            expect(userService.getUserByUserName).toBeCalledTimes(1);
            expect(userService.insertUser).toBeCalledTimes(1);
            expect(res.json()).toBeCalledWith({message: "OK"})
        })
})