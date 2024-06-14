import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as jwt from "jsonwebtoken";
import * as argon from "argon2";
import { PrismaService } from "src/config/prisma/prisma.service";
import { CreateAuthorizationDto } from "./dto/create-authorization.dto";
import { UpdateAuthorizationDto } from "./dto/update-authorization.dto";

@Injectable()
export class AuthorizationService {

  constructor(
    private config: ConfigService,
    private prismaService: PrismaService
  ) {
  }

 async signUp(createAuthorizationDto: CreateAuthorizationDto) {
    console.log('data', createAuthorizationDto)
    const user = await this.prismaService.accounts.findUnique({
      where: {
        username: createAuthorizationDto.username
      }
    });
    if (user) throw new ForbiddenException("Username has been registered");
    const hash = await argon.hash(createAuthorizationDto.password);
    await this.prismaService.accounts.create({
      data: {
        username: createAuthorizationDto.username,
        password: hash,
        name: createAuthorizationDto.name
      }
    });
    return this.signToken(createAuthorizationDto);
  }

  async signIn(createAuthorizationDto: CreateAuthorizationDto) {
    // find the user by username
    const user = await this.prismaService.accounts.findUnique({
      where: {
        username: createAuthorizationDto.username,
      },
    });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');
    //compare password
    const pwMatches = await argon.verify(
      user.password,
      createAuthorizationDto.password,
    );
    //if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    // send back the user
    return this.signToken(createAuthorizationDto);
  }

  findAll() {
    return this.prismaService.accounts.findMany();
  }

  findOne(id: number) {
    return this.prismaService.accounts.findFirst({
      where: {
        id: id
      }
    });
  }

  update(id: number, updateAuthorizationInput: UpdateAuthorizationDto) {
    return this.prismaService.accounts.update({
      where: {
        id: id
      },
      data: {
        ...updateAuthorizationInput
      }
    });
  }

  remove(id: number) {
    return this.prismaService.accounts.delete({
      where: {
        id: id
      }
    });
  }

  async signToken(createAuthorizationDto: CreateAuthorizationDto):
    Promise<{ access_token: string }> {
    const { username } = createAuthorizationDto;
    createAuthorizationDto;
    const payload = {
      username
    };
    const token: string = jwt.sign(payload, process.env.JWT_SECRET);
    return {
      access_token: token
    };
  }
}
