import bcrypt from "bcrypt";
import "dotenv/config";
import config from "../src/config";
import prisma from "../src/lib/prisma";
import { Role } from "./../src/generated/prisma/enums";

async function main() {
  const name = config?.admin_name;
  const email = config?.admin_email;
  const password = config?.admin_password;

  if (!name || !email || !password) {
    throw new Error("Admin environment variables are required");
  }

  if (password.length < 6) {
    throw new Error("Admin password must be at least 6 characters");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("Admin account seeded successfully");
}

main()
  .catch((error) => {
    console.error("Failed to seed admin:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
