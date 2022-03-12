/**
 * Split an array into multiple sub-arrays
 *
 * Make the sections as evenly sized as possible
 * @param {number} sections - The number of sections to split the array into
 * @param {T[]} array - The array to split
 * @returns {T[][]} The array split into sections
 * @example
 * >> const array = [1,2,3,4,5,6,7]
 * >> splitArrayIntoSubArrays(3, array)
 * [ [ 1, 2, 3 ], [ 4, 5 ], [ 6, 7 ] ]
 */
export function arraySplit<T>(sections: number, array: T[]): T[][] {
    if (sections < 1) {
        throw new Error('Can not split array into less than 1 section')
    }

    const len = array.length

    if (sections === 1 || len === 0) {
        return [array]
    }
    if (sections > len || sections === len) {
        sections = len

        return array.map((item) => [item])
    }

    const divPoint = Math.floor(len / sections)
    const extras = len % sections
    const sectionSizes: number[] = []

    // Calculate the size of each section
    for (let i = 0; i < extras; i++) {
        sectionSizes.push(divPoint + 1)
    }
    // Add the rest of the sections
    for (let i = 0; i < sections - extras; i++) {
        sectionSizes.push(divPoint)
    }

    const splitArrays: T[][] = []
    let startPoint = 0

    for (let i = 0; i < sectionSizes.length; i++) {
        const endPoint = startPoint + sectionSizes[i]

        splitArrays.push(array.slice(startPoint, endPoint))
        startPoint = endPoint
    }

    return splitArrays
}
