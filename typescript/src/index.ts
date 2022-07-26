import { ProductDataDTO } from './Types'
import { readFile } from 'fs/promises'
import { findProducts } from './utils'

async function main() {
    /* Import via FS as JSON file could get quite large and be a performance issue if coming in via import  */
    const productData = JSON.parse(
        await readFile('./assets/product_data.json', 'utf-8')
    ) as ProductDataDTO[]
    /* Log query to console for demonstration purposes  */
    console.log(findProducts({ products: productData, exclude: ['green'] }))
}

main()
