import { ProductColors, ProductDataDTO, ProductName, ProductSizes } from '../Types'
import { groupBy } from 'rambda'

interface FindProductsOptions {
    products: ProductDataDTO[]
    include?: Array<ProductColors | ProductSizes>
    exclude?: Array<ProductColors | ProductSizes>
}

export interface FoundProduct {
    name: ProductName
    codes: string[]
}

export function findProducts({ products, include, exclude }: FindProductsOptions) {
    // Filter products according to passed Arguments
    const filteredProducts = products.filter(product => {
        const includeAll = !include
        const onIncludeList = product.tags.some(tag =>
            include?.some(includeTag => tag === includeTag)
        )
        const onExcludeList = product.tags.some(tag =>
            exclude?.some(excludedTag => tag === excludedTag)
        )

        return (includeAll && !onExcludeList) || (onIncludeList && !onExcludeList)
    })

    // Build groupByName helper
    const groupByName = groupBy((product: ProductDataDTO) => product.name)

    // Group Items
    const groupedProducts = groupByName(filteredProducts)

    // Sanitize data to FoundProduct shape
    // TODO Refactor to use maps
    // TODO Potentially sort products alphabetically

    const foundProducts: FoundProduct[] = []
    for (const product in groupedProducts) {
        foundProducts.push({
            name: product as ProductName,
            codes: groupedProducts[product]
                .map(product => product.code)
                .sort()
                .reverse(),
        })
    }

    return foundProducts
}
