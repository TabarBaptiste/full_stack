import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) { }

  async create(createUserDto: CreateUserDto) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.database.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('L\'email existe déjà');
    }

    // Hacher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    return await this.database.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        phone: createUserDto.phone || '',
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findMe(userId: number) {
    const user = await this.database.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        // Inclure l'historique des réservations et achats
        reservations: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            price: true,
            createdAt: true,
            prestation: {
              select: {
                id: true,
                title: true,
                duration: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        orders: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
            createdAt: true,
            items: {
              include: {
                product: true,
              },
            },
            // product: {
            //   select: {
            //     id: true,
            //     name: true,
            //   },
            // },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        reviews: {
          select: {
            id: true,
            content: true,
            rating: true,
            visible: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateMe(userId: number, updateUserDto: UpdateUserDto) {
    // Vérifier que l'utilisateur existe
    const existingUser = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.database.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('L\'email existe déjà');
      }
    }

    const updatedUser = await this.database.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async updateUserRole(adminId: number, targetUserId: number, updateUserRoleDto: UpdateUserRoleDto) {
    // Vérifier que l'admin existe et a bien le rôle ADMIN
    const admin = await this.database.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can modify user roles');
    }

    // Vérifier que l'utilisateur cible existe
    const targetUser = await this.database.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (updateUserRoleDto.email && updateUserRoleDto.email !== targetUser.email) {
      const emailExists = await this.database.user.findUnique({
        where: { email: updateUserRoleDto.email },
      });

      if (emailExists) {
        throw new ConflictException('L\'email existe déjà');
      }
    }

    const updatedUser = await this.database.user.update({
      where: { id: targetUserId },
      data: updateUserRoleDto,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async deleteMe(userId: number) {
    // Vérifier que l'utilisateur existe
    const existingUser = await this.database.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            reservations: true,
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Supprimer l'utilisateur (les réservations et achats restent avec userId pour l'historique)
    await this.database.user.delete({
      where: { id: userId },
    });

    return {
      message: 'Account successfully deleted',
      preservedData: {
        reservations: existingUser._count.reservations,
        orders: existingUser._count.orders,
        reviews: existingUser._count.reviews,
      },
    };
  }

  // Méthodes pour l'admin seulement
  async findAll(adminId: number) {
    // Vérifier que c'est un admin
    const admin = await this.database.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can view all users');
    }

    return await this.database.user.findMany({
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reservations: true,
            orders: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(adminId: number, targetUserId: number) {
    // Vérifier que c'est un admin
    const admin = await this.database.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can view other users');
    }

    const user = await this.database.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        reservations: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            price: true,
            createdAt: true,
            prestation: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        orders: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
            createdAt: true,
            items: {
              include: {
                product: true,
              },
            },
            // product: {
            //   select: {
            //     id: true,
            //     name: true,
            //   },
            // },
          },
        },
        reviews: {
          select: {
            id: true,
            content: true,
            rating: true,
            visible: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}