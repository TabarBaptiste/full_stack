export class CreateProductDto {
    name: string
    description: string
    price: number
    stock: number
    createdAt?: Date | string
    updatedAt?: Date | string
    categoryId: number
}
