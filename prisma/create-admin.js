const { PrismaClient, UserRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const prisma = new PrismaClient();

function promptSecret(label) {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
      reject(new Error("Run this command from an interactive terminal."));
      return;
    }

    stdout.write(label);
    stdin.setRawMode(true);
    stdin.resume();
    let value = "";

    const finish = (error) => {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    };

    const onData = (chunk) => {
      for (const character of chunk.toString("utf8")) {
        if (character === "\u0003") {
          finish(new Error("Cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f" || character === "\b") {
          value = value.slice(0, -1);
        } else {
          value += character;
        }
      }
    };

    stdin.on("data", onData);
  });
}

async function main() {
  const existingSuperuser = await prisma.user.findFirst({
    where: { role: UserRole.SUPERUSER },
    select: { id: true },
  });
  if (existingSuperuser) {
    throw new Error("A superuser already exists. Manage accounts in the admin Users page.");
  }

  const terminal = readline.createInterface({ input: stdin, output: stdout });
  const username = (await terminal.question("Superuser username: ")).trim().toLowerCase();
  const name = (await terminal.question("Display name: ")).trim();
  terminal.close();

  if (!/^[a-z0-9._-]{3,64}$/.test(username)) {
    throw new Error("Username must be 3-64 characters: lowercase letters, numbers, dot, underscore, or hyphen.");
  }
  if (!name || name.length > 120) {
    throw new Error("Display name is required and must be at most 120 characters.");
  }

  const password = await promptSecret("Password (minimum 12 characters): ");
  const confirmation = await promptSecret("Confirm password: ");
  if (password.length < 12) throw new Error("Password must contain at least 12 characters.");
  if (password !== confirmation) throw new Error("Passwords do not match.");

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { username, name, passwordHash, role: UserRole.SUPERUSER },
  });
  console.info(`Superuser ${username} created.`);
}

main()
  .catch((error) => {
    console.error(error.message || "Superuser creation failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });