import { config } from "dotenv";

config();

export default {
    db1: {
        host: process.env.HOST || "",
        database: process.env.DATABASE || "",
        user: process.env.USER || "",
        password: process.env.PASSWORD || "",
      },
      db2: {
        host: process.env.HOST1 || "",
        database: process.env.DATABASE1 || "",
        user: process.env.USER1 || "",
        password: process.env.PASSWORD1 || "",
      },
      db3: {
        host: process.env.HOST2 || "",
        database: process.env.DATABASE2 || "",
        user: process.env.USER2 || "",
        password: process.env.PASSWORD2 || "",
      },
}