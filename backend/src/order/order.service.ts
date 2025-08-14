import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus, Role } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: DatabaseService) { }

  async create(createOrderDto: CreateOrderDto, userId: number) {
    return this.prisma.$transaction(async (prisma) => {
      // Vérifier que tous les produits existent et ont suffisamment de stock
      const productChecks = await Promise.all(
        createOrderDto.items.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new NotFoundException(`Product with ID ${item.productId} not found`);
          }

          if (product.stock < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
            );
          }

          return {
            product,
            quantity: item.quantity,
          };
        })
      );

      // Calculer le prix total
      const totalPrice = productChecks.reduce((total, { product, quantity }) => {
        return total + (product.price * quantity);
      }, 0);

      // Créer la commande
      const order = await prisma.order.create({
        data: {
          userId,
          totalPrice,
          status: OrderStatus.PENDING,
        },
      });

      // Créer les lignes de commande et décrémenter le stock
      await Promise.all(
        productChecks.map(async ({ product, quantity }) => {
          // Créer la ligne de commande
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: product.id,
              quantity,
              price: product.price, // Prix unitaire figé au moment de la commande
            },
          });

          // Décrémenter le stock
          await prisma.product.update({
            where: { id: product.id },
            data: {
              stock: {
                decrement: quantity,
              },
            },
          });
        })
      );

      // Retourner la commande avec ses items
      return prisma.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      });
    });
  }

  async findAll(userId: number, userRole: Role) {
    const whereClause = userRole === Role.ADMIN ? {} : { userId };

    return this.prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number, userRole: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Vérifier les permissions d'accès
    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('You can only access your own orders');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, userId: number, userRole: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Logique de permissions pour la modification
    if (userRole === Role.CLIENT) {
      // CLIENT : peut uniquement annuler sa propre commande si elle n'est pas DELIVERED
      if (order.userId !== userId) {
        throw new ForbiddenException('You can only modify your own orders');
      }

      if (updateOrderDto.status && updateOrderDto.status !== OrderStatus.CANCELLED) {
        throw new ForbiddenException('Clients can only cancel their orders');
      }

      if (order.status === OrderStatus.DELIVERED) {
        throw new BadRequestException('Cannot cancel a delivered order');
      }

      // Si on annule, on doit remettre le stock
      if (updateOrderDto.status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
        await this.restoreStock(order.items);
      }
    } else if (userRole === Role.ADMIN) {
      // ADMIN : peut modifier le statut librement
      // Si on annule une commande qui ne l'était pas encore, on remet le stock
      if (updateOrderDto.status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
        await this.restoreStock(order.items);
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number, userRole: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Seuls les admins peuvent supprimer des commandes
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Only administrators can delete orders');
    }

    // Remettre le stock si la commande n'était pas annulée
    if (order.status !== OrderStatus.CANCELLED) {
      await this.restoreStock(order.items);
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return { message: 'Order deleted successfully' };
  }

  private async restoreStock(orderItems: any[]) {
    await Promise.all(
      orderItems.map(async (item) => {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      })
    );
  }
}