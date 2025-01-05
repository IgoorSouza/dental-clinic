import request from "supertest";
import express, { Express } from "express";
import UserController from "../../controllers/UserController";
import UserService from "../../services/UserService";
import { Role } from "@prisma/client";
import User from "../../interfaces/user";

jest.mock("../../services/UserService");
jest.mock("../../middlewares/AuthGuard", () => ({
  verifyAuthencation: jest.fn((req, res, next) => next()),
}));

const MockUserService = UserService as jest.MockedClass<typeof UserService>;

describe("UserController", () => {
  const app: Express = express();
  app.use(express.json());
  new UserController(app);

  it("Should return all users", async () => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Igor Souza de Castro",
        email: "igor.castro@estudante.iftm.edu.br",
        password: "123",
        role: Role.OWNER,
      },
      {
        id: "2",
        name: "Pedro Henrique Lopes",
        email: "pedro.lopes@estudante.iftm.edu.br",
        password: "321",
        role: Role.SUPERADMIN,
      },
    ];

    MockUserService.prototype.getUsers.mockResolvedValue(mockUsers);

    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
    expect(MockUserService.prototype.getUsers).toHaveBeenCalled();
  });

  it("Should return error when getting users", async () => {
    MockUserService.prototype.getUsers.mockRejectedValue(
      new Error("Error while getting users.")
    );

    const response = await request(app).get("/users");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while getting users.");
    expect(MockUserService.prototype.getUsers).toHaveBeenCalled();
  });

  it("Should create user", async () => {
    const mockUser: User = {
      name: "Igor Souza de Castro",
      email: "igor.castro@estudante.iftm.edu.br",
      password: "123",
      role: Role.OWNER,
    };
    const expectedUser: User = { ...mockUser, id: "1" }

    MockUserService.prototype.createUser.mockResolvedValue(expectedUser);

    const response = await request(app).post("/users/new").send(mockUser);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedUser);
    expect(MockUserService.prototype.createUser).toHaveBeenCalledWith(mockUser);
  });

  it("Should return error when creating user", async () => {
    MockUserService.prototype.createUser.mockRejectedValue(
      new Error("Error while creating user.")
    );

    const mockUser: User = {
      name: "Igor Souza de Castro",
      email: "igor.castro@estudante.iftm.edu.br",
      password: "123",
      role: Role.OWNER,
    };

    const response = await request(app).post("/users/new").send(mockUser);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while creating user.");
    expect(MockUserService.prototype.createUser).toHaveBeenCalledWith(mockUser);
  });

  it("Should update user", async () => {
    const mockUser: User = {
      id: "1",
      name: "Igor Souza",
      email: "igor.souza@estudante.iftm.edu.br",
      password: "321",
      role: Role.OWNER,
    };

    MockUserService.prototype.updateUser.mockResolvedValue(mockUser);

    const response = await request(app).put("/users/update").send({
      id: "1",
      name: "Igor Souza",
      email: "igor.souza@estudante.iftm.edu.br",
      password: "321",
      role: Role.OWNER,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(MockUserService.prototype.updateUser).toHaveBeenCalledWith(mockUser);
  });

  it("Should return error when updating user", async () => {
    const mockUser = {
      id: "1",
      name: "Igor Souza",
      email: "igor.souza@estudante.iftm.edu.br",
      password: "321",
      role: Role.OWNER,
    };

    MockUserService.prototype.updateUser.mockRejectedValue(
      new Error("Error while updating user.")
    );

    const response = await request(app).put("/users/update").send(mockUser);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while updating user.");
    expect(MockUserService.prototype.updateUser).toHaveBeenCalledWith(mockUser);
  });

  it("Should delete user", async () => {
    MockUserService.prototype.deleteUser.mockResolvedValue();

    const response = await request(app).delete("/users/delete/1");

    expect(response.status).toBe(200);
    expect(response.text).toBe("User successfully deleted.");
    expect(MockUserService.prototype.deleteUser).toHaveBeenCalledWith("1");
  });

  it("Should return 500 if an error occurs", async () => {
    MockUserService.prototype.deleteUser.mockRejectedValue(
      new Error("Error while deleting user.")
    );

    const response = await request(app).delete("/users/delete/1");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while deleting user.");
    expect(MockUserService.prototype.deleteUser).toHaveBeenCalledWith("1");
  });
});
