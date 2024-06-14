import { PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

export class  PrismaService extends PrismaClient {

  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_SQLITE,
        }
      }
    })
  }
  cleanDb() {
    return this.$transaction([
      this.accounts.deleteMany(),
    ])
  }
}
