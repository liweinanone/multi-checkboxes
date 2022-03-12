import { arraySplit } from '../arraySplit'

describe('Specify the number of sections to split the array', () => {
    describe('The number of sections is less than 1', () => {
        it('Should throw a error', () => {
            expect(() => {
                arraySplit(0, [1, 2, 3])
            }).toThrowError('Can not split array into less than 1 section')
        })
    })
    describe('The number of sections is greater than the length of the array', () => {
        it('Should split by the length of the array', () => {
            expect(arraySplit(10, [1, 2, 3])).toEqual([[1], [2], [3]])
        })
    })

    it('Should split by the number of sections', () => {
        const array = [1, 2, 3, 4, 5, 6, 7]

        expect(arraySplit(3, array)).toEqual([
            [1, 2, 3],
            [4, 5],
            [6, 7],
        ])
    })
})
