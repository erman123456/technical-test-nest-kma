import { Module } from "@nestjs/common";
import { AuthorizationModule } from "./authorization/authorization.module";
import { PrismaModule } from "./config/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    AuthorizationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule
  ]
})
export class AppModule {
}
