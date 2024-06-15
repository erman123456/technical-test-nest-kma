import { PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

export class  PrismaService extends PrismaClient {

  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: process.env.POSTGRES_PRISMA_URL,
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
