import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
// import { CreatePrestationDto } from './dto/create-prestation.dto';
// import { UpdatePrestationDto } from './dto/update-prestation.dto';

@Injectable()
export class PrestationService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(data: Prisma.PrestationCreateInput) {
    return this.databaseService.prestation.create({
      data
    });
  }

  // async findAll(role?: 'USER' | 'ADMIN') {
    async findAll() {
    // if (role) return this.databaseService.prestation.findMany({ where: { role } });
    return this.databaseService.prestation.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.prestation.findUnique({
      where: { id, }
    });
  }

  async update(id: number, updatePrestationDto: Prisma.PrestationUpdateInput) {
    return this.databaseService.prestation.update({
      where: { id },
      data: updatePrestationDto
    });
  }

  async remove(id: number) {
    return this.databaseService.prestation.delete({
      where: { id }
    });
  }
}
