import "dotenv/config";
import { Command } from "commander";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const program = new Command();

program
  .name("user-manager")
  .description("CLI to manage users for EMR system")
  .version("1.0.0");

program
  .command("create")
  .description("Create a new user")
  .requiredOption("-u, --username <username>", "Username for login")
  .requiredOption("-p, --password <password>", "Password")
  .requiredOption("-n, --name <name>", "Full name of the user")
  .action(async (options) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { username: options.username },
      });

      if (existingUser) {
        console.error(`Error: User with username '${options.username}' already exists.`);
        process.exit(1);
      }

      const hashedPassword = await bcrypt.hash(options.password, 10);

      const user = await prisma.user.create({
        data: {
          username: options.username,
          password: hashedPassword,
          name: options.name,
        },
      });

      console.log(`Success: User '${user.username}' created with ID ${user.id}`);
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      await prisma.$disconnect();
    }
  });

program
  .command("list")
  .description("List all users")
  .action(async () => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, username: true, name: true, createdAt: true },
      });

      if (users.length === 0) {
        console.log("No users found.");
      } else {
        console.table(users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      await prisma.$disconnect();
    }
  });

program
  .command("delete")
  .description("Delete a user by username")
  .requiredOption("-u, --username <username>", "Username to delete")
  .action(async (options) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username: options.username },
      });

      if (!user) {
        console.error(`Error: User '${options.username}' not found.`);
        process.exit(1);
      }

      await prisma.user.delete({
        where: { username: options.username },
      });

      console.log(`Success: User '${options.username}' has been deleted.`);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      await prisma.$disconnect();
    }
  });

program.parse(process.argv);
