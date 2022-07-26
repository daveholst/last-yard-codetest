import { ProductColors, ProductDataDTO, ProductName, ProductSizes } from '../Types'

interface findProductsOptions {
    products: ProductDataDTO[]
    include?: Array<ProductColors | ProductSizes>
    exclude?: Array<ProductColors | ProductSizes>
}

export interface foundProduct {
    name: ProductName
    codes: string[]
}

export function findProducts({ products, include, exclude }: findProductsOptions): foundProduct[] {
    return []
}
