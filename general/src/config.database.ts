import { DefaultArgs } from "@prisma/client/runtime/library";
import { PrismaClient } from "@xprisma/client";

// todo: setup storage
const prisma = new PrismaClient({
  log: ["query"],
  omit: { user: { password: true } },
});
const testDBConnection = async () => {
  try {
    await prisma.$connect();
    logging.info("successfully connected to database");
  } catch (error) {
    logging.error("database failed to connect");
    process.exit(1);
  }
};

// todo: setup global definition
declare global {
  var testDBConnection: () => Promise<void>;
  var database: PrismaClient<
    {
      log: "query"[];
      omit: {
        user: {
          password: true;
          pin: true;
        };
      };
    },
    never,
    DefaultArgs
  >;
}

// todo: setup link the local and global variable
globalThis.database = prisma;
globalThis.testDBConnection = testDBConnection;
export { testDBConnection };
