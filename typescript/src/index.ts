import { ProductDataDTO } from './Types'
import { readFile } from 'fs/promises'

/* Import via FS as JSON file could get quite large and be a performance issue if coming in via import  */
const productData = JSON.parse(
    await readFile('./assets/product_data.json', 'utf-8')
) as ProductDataDTO[]

console.log(productData)
// const1 productData = JSON.parse(jsonData)
