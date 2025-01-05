import JwtService from "../../services/JwtService";
import jwt from "jsonwebtoken";
import User from "../../interfaces/user";
import { Role } from "@prisma/client";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("JwtService", () => {
  const mockUser: User = {
    id: "1",
    name: "Igor Souza de Castro",
    email: "igor.castro@estudante.iftm.edu.br",
    password: "123",
    role: Role.ADMIN,
  };

  it("Should return access token", () => {
    const mockToken = "token";
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const token = JwtService.generateToken(mockUser);

    expect(token).toBe(mockToken);
    expect(jwt.sign).toHaveBeenCalledWith(mockUser, undefined, {
      expiresIn: "7d",
    });
  });

  it("Should throw error when generating token", () => {
    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw new Error("Error generating token");
    });

    expect(() => JwtService.generateToken(mockUser)).toThrow(
      "Error generating token"
    );
  });

  it("Should verify token and return user data", () => {
    const mockToken = "token";
    (jwt.verify as jest.Mock).mockReturnValue(mockUser);

    const user = JwtService.verifyToken(mockToken);

    expect(user).toEqual(mockUser);
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, undefined);
  });

  it("Should throw error when verifying token", () => {
    const mockToken = "token";
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    expect(() => JwtService.verifyToken(mockToken)).toThrow("Invalid token");
  });
});
