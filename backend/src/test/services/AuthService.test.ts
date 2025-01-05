import AuthService from "../../services/AuthService";
import JwtService from "../../services/JwtService";
import UserRepository from "../../repositories/UserRepository";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import AuthData from "../../interfaces/auth-data";

jest.mock("../../repositories/UserRepository");
jest.mock("../../services/JwtService", () => ({
  generateToken: jest.fn(() => "accessToken"),
}));
jest.mock("bcrypt", () => ({
  compare: jest.fn(() => Promise.resolve(true)),
}));

const MockUserRepository = UserRepository as jest.MockedClass<
  typeof UserRepository
>;

describe("AuthService", () => {
  const authService: AuthService = new AuthService();

  it("Should successfully authenticate", async () => {
    const name: string = "Igor Souza de Castro";
    const email: string = "igor.castro@estudante.iftm.edu.br";
    const password: string = "123";
    const role: Role = Role.ADMIN;

    const mockUser = {
      name,
      email,
      password,
      role,
    };

    const mockAuthData: AuthData = {
      accessToken: "accessToken",
      name,
      email,
      role,
    };

    MockUserRepository.prototype.getUserByEmail.mockResolvedValue(mockUser);

    const response = await authService.authenticate(email, password);

    expect(response).toEqual(mockAuthData);
    expect(MockUserRepository.prototype.getUserByEmail).toHaveBeenCalledWith(
      email
    );
    expect(bcrypt.compare).toHaveBeenCalledWith("123", password);
    expect(JwtService.generateToken).toHaveBeenCalledWith(mockUser);
  });

  it("Should throw an error if the user is not found", async () => {
    MockUserRepository.prototype.getUserByEmail.mockResolvedValue(null);

    await expect(
      authService.authenticate("abc@gmail.com", "321")
    ).rejects.toThrow("User not found");
  });

  it("Should throw an error if the password is incorrect", async () => {
    const mockUser = {
      name: "Igor Souza de Castro",
      email: "igor.castro@estudante.iftm.edu.br",
      password: "123",
      role: Role.ADMIN,
    };

    MockUserRepository.prototype.getUserByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.authenticate(mockUser.email, "321")
    ).rejects.toThrow("Invalid password");
  });
});
