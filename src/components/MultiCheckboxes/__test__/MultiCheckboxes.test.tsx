/**
 * @jest-environment jsdom
 */

import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { MultiCheckboxes } from '@/components'
import { options } from '@/test/data'

function createSomeValues(all: boolean): string[] {
    if (all) return options.map((option) => option.value)

    const values: string[] = []
    const n = Math.floor(Math.random() * 4) + 2

    for (let i = 0; i < options.length; i++) {
        if (i % n === 0) {
            values.push(options[i].value)
        }
    }

    return values
}

describe('MultiCheck', () => {
    describe('Initialize', () => {
        it('Render label if provided', () => {
            const label = '__TEST__LABEL__'

            render(<MultiCheckboxes label={label} options={options} />)

            const labelEl = screen.getByText(label)

            expect(labelEl.innerHTML).toEqual(label)
        })

        it('Render default label if no label is provided', () => {
            const defaultLabel = 'My Multi Checkboxes'

            render(<MultiCheckboxes options={options} />)

            const labelEl = screen.getByText(defaultLabel)

            expect(labelEl.innerHTML).toEqual(defaultLabel)
        })

        it('If values(default selected options) are provided, the corresponding checkboxes should be checked', () => {
            const values: string[] = createSomeValues(false)

            // Provide some values but not all
            const { rerender } = render(
                <MultiCheckboxes options={options} values={values} />
            )

            const checkboxes = screen.getAllByRole<HTMLInputElement>('checkbox')

            checkboxes.forEach((checkbox, index) => {
                if (index === 0) {
                    expect(checkbox.checked).toBe(false)

                    return
                }
                const value = checkbox.value
                const checked = checkbox.checked

                expect(checked).toBe(values.includes(value))
            })

            rerender(
                // Provide all values
                <MultiCheckboxes options={options} values={createSomeValues(true)} />
            )

            const checkboxes2 = screen.getAllByRole<HTMLInputElement>('checkbox')

            checkboxes2.forEach((checkbox) => {
                console.log(checkbox.value, checkbox.checked)
            })
        })

        it('If columns are undefined, display checkboxes in a column', () => {
            const { container } = render(<MultiCheckboxes options={options} />)
            const column = container.getElementsByClassName(
                'multi-checkboxes__columns--column'
            )

            expect(column.length).toBe(1)
        })

        it('If columns are provided and not exceed the length of options, display checkboxes in columns', () => {
            const columns = 4
            const { container } = render(
                <MultiCheckboxes options={options} columns={columns} />
            )
            const displayColumns = container.getElementsByClassName(
                'multi-checkboxes__columns--column'
            )

            expect(displayColumns.length).toBe(columns)
        })

        it('If columns are provided and exceed the length of options, The number of columns is equal to the length of the options', () => {
            const columns = options.length + 1024
            const { container } = render(
                <MultiCheckboxes options={options} columns={columns} />
            )
            const displayColumns = container.getElementsByClassName(
                'multi-checkboxes__columns--column'
            )

            // +1: select all checkbox
            expect(displayColumns.length).toBe(options.length + 1)
        })
    })

    describe('User interaction', () => {
        describe('A checkbox is checked', () => {
            it('If select all checkbox is clicked, all checkboxes are checked or unchecked', () => {
                render(<MultiCheckboxes options={options} />)

                const checkboxes = screen.getAllByRole<HTMLInputElement>('checkbox')

                checkboxes.forEach((checkbox) => {
                    expect(checkbox.checked).toBe(false)
                })

                // Click select all checkbox
                fireEvent.click(checkboxes[0])

                checkboxes.forEach((checkbox) => {
                    expect(checkbox.checked).toBe(true)
                })

                fireEvent.click(checkboxes[0])

                checkboxes.forEach((checkbox) => {
                    expect(checkbox.checked).toBe(false)
                })
            })

            it('If a option checkbox is clicked, the checkbox and select all checkbox is checked or unchecked', () => {
                const values = createSomeValues(false)

                render(<MultiCheckboxes options={options} values={values} />)

                const checkboxes = screen.getAllByRole<HTMLInputElement>('checkbox')
                const willClickedCheckbox = checkboxes.find(
                    (checkbox, index) =>
                        index !== 0 && !values.includes(checkbox.value)
                ) as HTMLInputElement
                const selectAllOption = checkboxes[0]

                expect(willClickedCheckbox.checked).toBe(false)
                fireEvent.click(willClickedCheckbox)
                expect(willClickedCheckbox.checked).toBe(true)
                expect(selectAllOption.checked).toBe(false)
            })
        })
    })
})
