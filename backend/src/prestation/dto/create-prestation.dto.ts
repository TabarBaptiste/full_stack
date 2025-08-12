export class CreatePrestationDto {
    title: string
    description: string
    duration: number
    price: number
    createdAt?: Date | string
    updatedAt?: Date | string
    categoryId: number
}
