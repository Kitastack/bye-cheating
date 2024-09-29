import { PrismaClient } from "@prisma/client";
import { info as loggerInfo, error as loggerError } from "@utils/logger";

const prisma = new PrismaClient({ log: ["query"] });

const testDBConnection = async () => {
  try {
    await prisma.$connect();
    loggerInfo("database", "successfully connected to database");
  } catch (error) {
    loggerError("database", "failed to connect database");
    console.error(error);
    process.exit(1);
  }
};

export { testDBConnection };
export default prisma;
