import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

interface CurrentUserType {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  phone: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // POST /users - Création d'utilisateur (Admin uniquement)
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // GET /users/me - Profil de l'utilisateur connecté
  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@CurrentUser() user: CurrentUserType) {
    return this.usersService.findMe(user.id);
  }

  // PATCH /users/me - Modification du profil de l'utilisateur connecté
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateMe(
    @CurrentUser() user: CurrentUserType,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateMe(user.id, updateUserDto);
  }

  // DELETE /users/me - Suppression du compte utilisateur
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  deleteMe(@CurrentUser() user: CurrentUserType) {
    return this.usersService.deleteMe(user.id);
  }

  // GET /users - Liste de tous les utilisateurs (Admin uniquement)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.usersService.findAll(user.id);
  }

  // GET /users/:id - Détails d'un utilisateur (Admin uniquement)
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findOne(
    @CurrentUser() user: CurrentUserType,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.findOne(user.id, id);
  }

  // PATCH /users/:id - Modification d'un utilisateur par l'admin (y compris le rôle)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateUserRole(
    @CurrentUser() user: CurrentUserType,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateUserRole(user.id, id, updateUserRoleDto);
  }
}