import grpc from "@grpc/grpc-js";

import { RegisterUser } from "../../application/use-cases/RegisterUser.js";
import { LoginUser } from "../../application/use-cases/LoginUser.js";
import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

const registerUser = new RegisterUser();
const loginUser = new LoginUser();
const userRepository = new UserRepository();

export const authGrpcHandler = {
  register: async (call, callback) => {
    try {
      const { username, password } = call.request;

      const result = await registerUser.execute({
        username,
        password,
      });

      callback(null, {
        success: true,
        message: "Register successful",
        token: "",
        uid: result.uid,
        role: result.role,
      });
    } catch (error) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: error.message,
      });
    }
  },

  login: async (call, callback) => {
    try {
      const { username, password } = call.request;

      const result = await loginUser.execute({
        username,
        password,
      });

      callback(null, {
        success: true,
        message: "Login successful",
        token: result.token,
        uid: result.uid,
        role: result.role,
      });
    } catch (error) {
      callback({
        code: grpc.status.UNAUTHENTICATED,
        message: error.message,
      });
    }
  },

  getUserById: async (call, callback) => {
    try {
      const uid = Number(call.request.uid);

      const user = await userRepository.findById(uid);

      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "User not found",
        });
      }

      callback(null, {
        uid: user.uid,
        username: user.username,
        roleid: user.roleid,
        rolename: user.role.rolename,
      });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },
};