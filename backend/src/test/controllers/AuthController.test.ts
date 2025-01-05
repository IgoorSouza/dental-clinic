import request from "supertest";
import express, { Express } from "express";
import AuthController from "../../controllers/AuthController";
import AuthService from "../../services/AuthService";
import { Role } from "@prisma/client";

jest.mock("../../services/AuthService");

const MockAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe("AuthController", () => {
  const app: Express = express();
  app.use(express.json());
  new AuthController(app);

  it("Should successfully authenticate", async () => {
    const mockUser = {
      email: "igor.castro@estudante.iftm.edu.br",
      password: "123",
      role: Role.ADMIN,
      name: "Igor Souza de Castro",
    };

    const mockAuthData = {
      accessToken: "validAccessToken",
      email: mockUser.email,
      role: mockUser.role,
      name: mockUser.name,
    };

    MockAuthService.prototype.authenticate.mockResolvedValue(mockAuthData);

    const response = await request(app)
      .post("/auth")
      .send({ email: mockUser.email, password: "123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAuthData);
    expect(MockAuthService.prototype.authenticate).toHaveBeenCalledWith(
      mockUser.email,
      "123"
    );
  });

  it("Should fail authentication if user is not found", async () => {
    MockAuthService.prototype.authenticate.mockRejectedValue(
      new Error("User not found")
    );

    const response = await request(app)
      .post("/auth")
      .send({ email: "abc@gmail.com", password: "123" });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while authenticating.");
    expect(MockAuthService.prototype.authenticate).toHaveBeenCalledWith(
      "abc@gmail.com",
      "123"
    );
  });

  it("Should fail authentication if password is incorrect", async () => {
    MockAuthService.prototype.authenticate.mockRejectedValue(
      new Error("Invalid password")
    );

    const response = await request(app).post("/auth").send({
      email: "igor.castro@estudante.iftm.edu.br",
      password: "321",
    });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while authenticating.");
    expect(MockAuthService.prototype.authenticate).toHaveBeenCalledWith(
      "igor.castro@estudante.iftm.edu.br",
      "321"
    );
  });
});
