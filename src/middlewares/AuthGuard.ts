import { NextFunction, Request, Response } from "express";
import User from "../types/user";
import { Role } from "@prisma/client";
import JwtService from "../services/JwtService";

export default class AuthGuard {
  public static verifyAuthencation(
    request: Request,
    response: Response,
    next: NextFunction
  ): void {
    try {
      const token = request.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw new Error();
      }

      const user: User = JwtService.verifyToken(token);

      if (!AuthGuard.verifyRole(request.baseUrl, user.role)) {
        throw new Error();
      }

      next();
    } catch (error) {
      response
        .status(401)
        .send(
          "Authentication error: Invalid token or insufficient permissions."
        );
    }
  }

  private static verifyRole(requestUrl: string, role: string): boolean {
    if (requestUrl.includes("/users") && role !== Role.OWNER) {
      return false;
    }

    return true;
  }
}
