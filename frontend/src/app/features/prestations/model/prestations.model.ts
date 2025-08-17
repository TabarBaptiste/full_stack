export interface Prestation {
    id: number;
    title: string;
    description?: string;
    price: number;
    duration?: number; // en minutes
}

export interface CreatePrestationDto {
    title: string;
    description?: string;
    price: number;
    duration?: number;
}

export interface UpdatePrestationDto extends Partial<CreatePrestationDto> { }