import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(data: CreateReservationDto) {
    // Validation des dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('La date de fin doit être avant à la date de début');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('La date de début ne peut pas être dans le passé');
    }

    // Vérifier que l'utilisateur existe
    const user = await this.databaseService.user.findUnique({
      where: { id: data.userId }
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier que la prestation existe
    const prestation = await this.databaseService.prestation.findUnique({
      where: { id: data.prestationId }
    });
    if (!prestation) {
      throw new NotFoundException('Prestation non trouvée');
    }

    // Vérifier les conflits de créneaux (pas de double réservation)
    await this.checkTimeSlotConflict(startDate, endDate, data.prestationId);

    return this.databaseService.reservation.create({
      data: {
        startDate,
        endDate,
        status: data.status || ReservationStatus.PENDING,
        price: prestation.price,
        userId: data.userId,
        prestationId: data.prestationId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          }
        },
        prestation: true,
      }
    });
  }

  async findAll(filters?: {
    userId?: number;
    status?: ReservationStatus;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.status) where.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
      where.AND = [];
      if (filters.startDate) {
        where.AND.push({ startDate: { gte: filters.startDate } });
      }
      if (filters.endDate) {
        where.AND.push({ endDate: { lte: filters.endDate } });
      }
    }

    return this.databaseService.reservation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          }
        },
        prestation: true,
      },
      orderBy: {
        startDate: 'asc'
      }
    });
  }

  async findOne(id: number) {
    const reservation = await this.databaseService.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          }
        },
        prestation: true,
      }
    });

    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    return reservation;
  }

  async findByUser(userId: number) {
    return this.databaseService.reservation.findMany({
      where: { userId },
      include: {
        prestation: true,
      },
      orderBy: {
        startDate: 'asc'
      }
    });
  }

  async findUpcoming() {
    return this.databaseService.reservation.findMany({
      where: {
        startDate: {
          gte: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          }
        },
        prestation: true,
      },
      orderBy: {
        startDate: 'asc'
      }
    });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    // Vérifier que la réservation existe
    const existingReservation = await this.findOne(id);

    // Si on met à jour les dates, valider
    if (updateReservationDto.startDate || updateReservationDto.endDate) {
      const startDate = updateReservationDto.startDate
        ? new Date(updateReservationDto.startDate)
        : existingReservation.startDate;
      const endDate = updateReservationDto.endDate
        ? new Date(updateReservationDto.endDate)
        : existingReservation.endDate;

      if (startDate >= endDate) {
        throw new BadRequestException('La date de fin doit être postérieure à la date de début');
      }

      // Vérifier les conflits (en excluant la réservation actuelle)
      await this.checkTimeSlotConflict(startDate, endDate, existingReservation.prestationId, id);
    }

    const updateData: any = {};

    if (updateReservationDto.startDate) {
      updateData.startDate = new Date(updateReservationDto.startDate);
    }
    if (updateReservationDto.endDate) {
      updateData.endDate = new Date(updateReservationDto.endDate);
    }
    if (updateReservationDto.status) {
      updateData.status = updateReservationDto.status;
    }
    if (updateReservationDto.price !== undefined) {
      updateData.price = updateReservationDto.price;
    }

    return this.databaseService.reservation.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          }
        },
        prestation: true,
      }
    });
  }

  async updateStatus(id: number, status: ReservationStatus) {
    await this.findOne(id); // Vérifier que la réservation existe

    return this.databaseService.reservation.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          }
        },
        prestation: true,
      }
    });
  }

  async cancel(id: number) {
    const reservation = await this.findOne(id);

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Cette réservation est déjà annulée');
    }

    if (reservation.status === ReservationStatus.COMPLETED) {
      throw new BadRequestException('Impossible d\'annuler une réservation terminée');
    }

    return this.updateStatus(id, ReservationStatus.CANCELLED);
  }

  async confirm(id: number) {
    return this.updateStatus(id, ReservationStatus.CONFIRMED);
  }

  async complete(id: number) {
    return this.updateStatus(id, ReservationStatus.COMPLETED);
  }

  async remove(id: number) {
    await this.findOne(id); // Vérifier que la réservation existe

    return this.databaseService.reservation.delete({
      where: { id }
    });
  }

  // Méthodes utilitaires privées
  private async checkTimeSlotConflict(
    startDate: Date,
    endDate: Date,
    prestationId: number,
    excludeReservationId?: number
  ) {
    const conflictingReservations = await this.databaseService.reservation.findMany({
      where: {
        prestationId,
        status: {
          not: ReservationStatus.CANCELLED
        },
        OR: [
          // Nouvelle réservation commence pendant une réservation existante
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gt: startDate } }
            ]
          },
          // Nouvelle réservation finit pendant une réservation existante
          {
            AND: [
              { startDate: { lt: endDate } },
              { endDate: { gte: endDate } }
            ]
          },
          // Nouvelle réservation englobe une réservation existante
          {
            AND: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } }
            ]
          }
        ],
        ...(excludeReservationId && { id: { not: excludeReservationId } })
      }
    });

    if (conflictingReservations.length > 0) {
      throw new ConflictException('Ce créneau horaire n\'est pas disponible');
    }
  }

  // Méthodes pour obtenir des statistiques
  async getReservationStats() {
    const total = await this.databaseService.reservation.count();
    const pending = await this.databaseService.reservation.count({
      where: { status: ReservationStatus.PENDING }
    });
    const confirmed = await this.databaseService.reservation.count({
      where: { status: ReservationStatus.CONFIRMED }
    });
    const completed = await this.databaseService.reservation.count({
      where: { status: ReservationStatus.COMPLETED }
    });
    const cancelled = await this.databaseService.reservation.count({
      where: { status: ReservationStatus.CANCELLED }
    });

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled
    };
  }

  // Obtenir les créneaux disponibles pour une date donnée
  async getAvailableSlots(date: Date, prestationId: number) {
    // Cette méthode pourrait être étendue pour définir des créneaux horaires fixes
    // et retourner ceux qui ne sont pas encore réservés
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reservedSlots = await this.databaseService.reservation.findMany({
      where: {
        prestationId,
        status: {
          not: ReservationStatus.CANCELLED
        },
        startDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      select: {
        startDate: true,
        endDate: true
      }
    });

    return reservedSlots;
  }
}