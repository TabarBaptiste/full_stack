import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query,
  ParseIntPipe,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { PrestationsService } from './prestations.service';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('prestation')
export class PrestationsController {
  constructor(private readonly prestationsService: PrestationsService) {}

  // POST /prestations - Création (ADMIN uniquement)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createPrestationDto: CreatePrestationDto) {
    return this.prestationsService.create(createPrestationDto);
  }

  // GET /prestations - Lecture (accessible à tous)
  @Get()
  findAll(@Query('category') categoryId?: string, @Query('search') search?: string) {
    if (search) {
      return this.prestationsService.searchPrestations(search);
    }
    if (categoryId) {
      return this.prestationsService.findByCategory(+categoryId);
    }
    return this.prestationsService.findAll();
  }

  // GET /prestations/:id - Lecture d'une prestation (accessible à tous)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prestationsService.findOne(id);
  }

  // PATCH /prestations/:id - Modification (ADMIN uniquement)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePrestationDto: UpdatePrestationDto
  ) {
    return this.prestationsService.update(id, updatePrestationDto);
  }

  // DELETE /prestations/:id - Suppression (ADMIN uniquement)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prestationsService.remove(id);
  }

  // GET /prestations/category/:categoryId - Prestations par catégorie (accessible à tous)
  @Get('category/:categoryId')
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.prestationsService.findByCategory(categoryId);
  }
}