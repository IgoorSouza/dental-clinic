import request from "supertest";
import express, { Express } from "express";
import AuthGuard from "../../middlewares/AuthGuard";
import JwtService from "../../services/JwtService";
import { Role } from "@prisma/client";

jest.mock("../../services/JwtService");

describe("AuthGuard", () => {
  const app: Express = express();
  app.use(express.json());
  app.use("/users", AuthGuard.verifyAuthencation, (req, res) => {
    res.status(200).send("Access granted.");
  });

  it("Should allow access with a valid token and sufficient role", async () => {
    const mockToken = "token";
    const mockUser = { role: Role.SUPERADMIN };

    JwtService.verifyToken = jest.fn().mockReturnValue(mockUser);

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Access granted.");
    expect(JwtService.verifyToken).toHaveBeenCalledWith(mockToken);
  });

  it("Should reject access if the token is invalid", async () => {
    const mockToken = "invalidToken";

    JwtService.verifyToken = jest.fn().mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(response.status).toBe(401);
    expect(response.text).toBe(
      "Authentication error: Invalid token or insufficient permissions."
    );
  });

  it("Should reject access if the role is insufficient", async () => {
    const mockToken = "token";
    const mockUser = { role: Role.ADMIN };

    JwtService.verifyToken = jest.fn().mockReturnValue(mockUser);

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(response.status).toBe(401);
    expect(response.text).toBe(
      "Authentication error: Invalid token or insufficient permissions."
    );
    expect(JwtService.verifyToken).toHaveBeenCalledWith(mockToken);
  });

  it("Should reject access if no token is provided", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(401);
    expect(response.text).toBe(
      "Authentication error: Invalid token or insufficient permissions."
    );
  });
});
