import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PrestationService } from './prestation.service';
import { Prisma } from '@prisma/client';
// import { CreatePrestationDto } from './dto/create-prestation.dto';
// import { UpdatePrestationDto } from './dto/update-prestation.dto';

@Controller('prestation')
export class PrestationController {
  constructor(private readonly prestationService: PrestationService) { }

  @Post()
  create(@Body() createPrestationDto: Prisma.PrestationCreateInput) {
    return this.prestationService.create(createPrestationDto);
  }

  // Lorsque je vais créé des Users (ajouter query dans 1er import)
  /*
  findAll(@Query('role) role ?: ADMIN | CLIENT) {
    return this.userService.findAll(role);
  }
  */
  @Get()
  findAll() {
    return this.prestationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prestationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePrestationDto: Prisma.PrestationUpdateInput) {
    return this.prestationService.update(id, updatePrestationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prestationService.remove(id);
  }
}
