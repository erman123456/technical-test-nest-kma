import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { UpdateAuthorizationDto } from './dto/update-authorization.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.gaurd';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('signUp')
  signUp(@Body() createAuthorizationDto: CreateAuthorizationDto) {
    return this.authorizationService.signUp(createAuthorizationDto);
  }
  @Post('signIn')
  signIn(@Body() createAuthorizationDto: CreateAuthorizationDto) {
    return this.authorizationService.signIn(createAuthorizationDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.authorizationService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.authorizationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateAuthorizationDto: UpdateAuthorizationDto) {
    return this.authorizationService.update(+id, updateAuthorizationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.authorizationService.remove(+id);
  }
}
