import { describe, expect, it } from 'vitest'
import { mockProductData } from '../testData/mockProductData'
import { findProducts } from './findProducts'

// TODO Proabably want these to check for a map or set?
describe('findProducts returns correct products', () => {
    it('when it takes an include value', () => {
        const result = findProducts({ products: mockProductData, include: ['red'] })
        expect(result).eq([
            {
                name: 'T-Shirt',
                codes: ['A21313'],
            },
        ])
    })

    it('when it takes multiple include values', () => {
        const result = findProducts({ products: mockProductData, include: ['green', 'medium'] })
        expect(result).eq([
            {
                name: 'T-Shirt',
                codes: ['A21312'],
            },
            {
                name: 'Pants',
                codes: ['A21455'],
            },
            {
                name: 'Socks',
                codes: ['A21412'],
            },
        ])
    })

    it('when it takes an exclude value', () => {
        const result = findProducts({ products: mockProductData, exclude: ['green'] })
        expect(result).eq([
            {
                name: 'T-Shirt',
                codes: ['A21313', 'A21311'],
            },
            {
                name: 'Pants',
                codes: ['A21317'],
            },
            {
                name: 'Socks',
                codes: ['A21319'],
            },
            {
                name: 'Jacket',
                codes: ['A21502', 'A21501'],
            },
        ])
    })

    it('takes multiple exclude values', () => {
        const result = findProducts({ products: mockProductData, exclude: ['green', 'small'] })
        expect(result).eq([
            {
                name: 'T-Shirt',
                codes: ['A21312', 'A21311'],
            },
            {
                name: 'Jacket',
                codes: ['A21501'],
            },
        ])
    })

    it('takes an exclude and an include value', () => {
        const result = findProducts({
            products: mockProductData,
            include: ['small'],
            exclude: ['green'],
        })
        expect(result).eq([
            {
                name: 'Pants',
                codes: ['A21317'],
            },
            {
                name: 'Socks',
                codes: ['A21319'],
            },
            {
                name: 'Jacket',
                codes: ['A21502'],
            },
        ])
    })

    it('takes no args and returns all products', () => {
        const result = findProducts({
            products: mockProductData,
        })
        expect(result).eq([
            {
                name: 'T-Shirt',
                codes: ['A21313', 'A21312', 'A21311'],
            },
            {
                name: 'Pants',
                codes: ['A21455', 'A21319'],
            },
            {
                name: 'Socks',
                codes: ['A21412', 'A21319'],
            },
            {
                name: 'Jacket',
                codes: ['A21502', 'A21502'],
            },
        ])
    })
})
