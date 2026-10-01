import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { UnauthorizedError } from "../errors/AppError.js";
import type { UserRepository } from "../repositories/UserRepository.js";

const TOKEN_TTL = "7d";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtSecret: string,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const token = jwt.sign({ sub: String(user.id) }, this.jwtSecret, { expiresIn: TOKEN_TTL });
    return { user: this.toPublicUser(user), token };
  }

  async getUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError();
    }
    return this.toPublicUser(user);
  }

  verifyToken(token: string): number {
    let userId = NaN;
    try {
      const payload = jwt.verify(token, this.jwtSecret);
      userId = typeof payload === "string" ? NaN : Number(payload.sub);
    } catch {
      throw new UnauthorizedError("Your session has expired, please log in again");
    }
    if (!Number.isInteger(userId)) {
      throw new UnauthorizedError();
    }
    return userId;
  }

  private toPublicUser(user: User) {
    return { id: user.id, email: user.email, name: user.name };
  }
}
