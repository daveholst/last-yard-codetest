export type ProductName = 'T-Shirt' | 'Pants' | 'Socks' | 'Jacket'
export type ProductColors = 'red' | 'green' | 'fuschia' | 'blue' | 'yellow' | 'black' | 'white'
export type ProductSizes = 'small' | 'medium' | 'large'

export interface ProductDataDTO {
    name: ProductName
    tags: Array<ProductColors | ProductSizes>
    code: string
}
