import UserService from "../../services/UserService";
import UserRepository from "../../repositories/UserRepository";
import bcrypt from "bcrypt";
import User from "../../interfaces/user";
import { Role } from "@prisma/client";

jest.mock("../../repositories/UserRepository");

const MockUserRepository = UserRepository as jest.MockedClass<
  typeof UserRepository
>;

describe("UserService", () => {
  const userService: UserService = new UserService();

  it("Should get all users", async () => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Igor Souza",
        email: "igor.souza@mail.com",
        password: "123",
        role: Role.ADMIN,
      },
    ];

    MockUserRepository.prototype.getUsers.mockResolvedValue(mockUsers);

    const result = await userService.getUsers();
    expect(result).toEqual(mockUsers);
    expect(MockUserRepository.prototype.getUsers).toHaveBeenCalled();
  });

  it("Should get user by id", async () => {
    const mockUser: User = {
      id: "1",
      name: "Igor Souza",
      email: "igor.souza@mail.com",
      password: "123",
      role: Role.ADMIN,
    };

    MockUserRepository.prototype.getUserById.mockResolvedValue(mockUser);

    const result = await userService.getUserById("1");

    expect(result).toEqual(mockUser);
    expect(MockUserRepository.prototype.getUserById).toHaveBeenCalledWith("1");
  });

  it("Should return null if user not found", async () => {
    MockUserRepository.prototype.getUserById.mockResolvedValue(null);
    const result = await userService.getUserById("0");
    expect(result).toBeNull();
  });

  it("Should create user", async () => {
    const newUser: User = {
      name: "Igor Souza de Castro",
      email: "igor.castro@estudante.iftm.edu.br",
      password: "123",
      role: Role.ADMIN,
    };

    const encryptedUser: User = {
      ...newUser,
      password: "hashedPassword",
    };

    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
    MockUserRepository.prototype.createUser.mockResolvedValue(encryptedUser);
    const result = await userService.createUser(newUser);

    expect(result.password).not.toBe(newUser.password);
    expect(MockUserRepository.prototype.createUser).toHaveBeenCalledWith(
      encryptedUser
    );
    expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 10);
  });

  it("Should update user", async () => {
    const updatedUser: User = {
      id: "1",
      name: "Igor Souza",
      email: "igor.souza@estudante.iftm.edu.br",
      password: "hashedPassword",
      role: "ADMIN",
    };

    MockUserRepository.prototype.updateUser.mockResolvedValue(updatedUser);

    const result = await userService.updateUser(updatedUser);
    expect(result.password).toBe(updatedUser.password);
    expect(MockUserRepository.prototype.updateUser).toHaveBeenCalledWith(
      updatedUser
    );
    expect(bcrypt.hash).toHaveBeenCalledWith(updatedUser.password, 10);
  });

  it("Should delete user", async () => {
    const userId = "1";
    const mockUser: User = {
      id: userId,
      name: "Igor Souza de Castro",
      email: "igor.castro@estudante.iftm.edu.br",
      password: "123",
      role: Role.ADMIN,
    };

    MockUserRepository.prototype.getUserById.mockResolvedValue(mockUser);
    MockUserRepository.prototype.deleteUser.mockResolvedValue();

    await userService.deleteUser(userId);

    expect(MockUserRepository.prototype.deleteUser).toHaveBeenCalledWith(
      userId
    );
  });

  it("Should throw error when deleting user", async () => {
    MockUserRepository.prototype.deleteUser.mockRejectedValue(
      new Error("Error deleting user.")
    );

    await expect(userService.deleteUser("1")).rejects.toThrow(
      "Error deleting user."
    );
    expect(MockUserRepository.prototype.deleteUser).toHaveBeenCalledWith("1");
  });

  it("Should throw error when deleting the system's owner", async () => {
    const ownerEmail = process.env.OWNER_EMAIL!;
    const userId = "1";
    const mockUser: User = {
      id: "1",
      name: "Igor Souza de Castro",
      email: ownerEmail,
      password: "123",
      role: Role.OWNER,
    };

    MockUserRepository.prototype.getUserById.mockResolvedValue(mockUser);

    await expect(userService.deleteUser(userId)).rejects.toThrow(
      "Not possible to delete the system's owner."
    );
  });
});
