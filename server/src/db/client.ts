import { Prisma, PrismaClient, enum_Users_role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { JWTUser } from "../types";
import { excludeFields } from "./utils";

const prisma = new PrismaClient().$extends({
  model: {
    users: {
      async signup(email: string, password: string, role: enum_Users_role) {
        const select = excludeFields<Prisma.UsersFieldRefs>(
          prisma.users.fields,
          ["password"],
        );
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await prisma.users.create({
          data: {
            username: email,
            password: hashedPassword,
            role: role,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          select,
        });

        return newUser;
      },
      async checkUser(
        email: string,
        password: string,
      ): Promise<JWTUser | null> {
        const user = await prisma.users.findUnique({
          where: { username: email },
        });
        if (!user) {
          return null;
        }

        if (await bcrypt.compare(password, user.password)) {
          const fetchedUser: JWTUser = {
            id: user.id,
            username: user.username,
            role: user.role,
          };

          return fetchedUser;
        } else {
          return null;
        }
      },
    },
  },
});

export default prisma;
