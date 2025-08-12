import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from '@prisma/client';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('status') status?: ReservationStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};

    if (userId) filters.userId = parseInt(userId);
    if (status) filters.status = status;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.reservationService.findAll(filters);
  }

  @Get('upcoming')
  findUpcoming() {
    return this.reservationService.findUpcoming();
  }

  @Get('stats')
  getStats() {
    return this.reservationService.getReservationStats();
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.reservationService.findByUser(userId);
  }

  @Get('available-slots')
  getAvailableSlots(
    @Query('date') date: string,
    @Query('prestationId', ParseIntPipe) prestationId: number
  ) {
    return this.reservationService.getAvailableSlots(new Date(date), prestationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: ReservationStatus
  ) {
    return this.reservationService.updateStatus(id, status);
  }

  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.confirm(id);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.cancel(id);
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.complete(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.remove(id);
  }
}