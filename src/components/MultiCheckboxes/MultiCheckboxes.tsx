import './MultiCheckboxes.css'

import * as React from 'react'

import type { Option, OptionWithChecked } from '@/types'
import { arraySplit } from '@/utils/arraySplit'
import { Checkbox } from '@/components'

interface MultiCheckboxesProps {
    options: Option[]
    columns?: number
    values?: string[]
    label?: string
    onChange?: (options: Option[]) => void
}

const UNIQUE_SELECT_ALL_VALUE = '__UNIQUE__SELECT__ALL__VALUE__'

function createInitialOptionsState(
    values: MultiCheckboxesProps['values'] = [],
    options: Option[],
    columns: number
): OptionWithChecked[][] {
    const initialReducerValue = [
        {
            label: 'Select All',
            value: UNIQUE_SELECT_ALL_VALUE,
            checked: values.length === options.length,
        },
    ]
    const optionWithChecked = options.reduce<OptionWithChecked[]>((acc, option) => {
        const checked = values.includes(option.value)

        acc.push({ ...option, checked })

        return acc
    }, initialReducerValue)

    return arraySplit(columns, optionWithChecked)
}

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. If columns > 1, the options should be placed from top to bottom in each column
 *
 * @param {string} label - the label text of this component
 * @param {Option[]} options - options. Assume no duplicated labels or values
 * @param {string[]} values - If `undefined`, makes the component in uncontrolled mode with no options checked;
 *                            if not undefined, makes the component to controlled mode with corresponding options checked.
 *                            Assume no duplicated values.
 * @param {number} columns - default value is 1, and assume it can only be [1, 2, ... 9]
 * @param {Function} onChange - if not undefined, when checked options are changed, they should be passed to outside;
 *                              if undefined, the options can still be selected, but won't notify the outside
 */
export function MultiCheckboxes({
    options,
    columns = 1,
    values,
    onChange,
    label = 'My Multi Checkboxes',
}: MultiCheckboxesProps): JSX.Element {
    const [optionsInColumns, setOptionsInColumns] = React.useState<
        OptionWithChecked[][]
    >(() => createInitialOptionsState(values, options, columns))
    // If values undefined, the component saves its own selected values
    // Priority: props.values > state.values
    const [unControlledValues, setUnControlledValues] = React.useState<string[]>([])

    function handleCheckboxChange(checkedOption: OptionWithChecked): void {
        if (checkedOption.value === UNIQUE_SELECT_ALL_VALUE) {
            handleSelectAllChange(checkedOption.checked)

            return
        }

        handleOptionChange(checkedOption)
    }

    function handleSelectAllChange(checked: boolean): void {
        const newOptionsInColumns = optionsInColumns.map((optionsInColumn) =>
            optionsInColumn.map((option) => ({ ...option, checked }))
        )

        setOptionsInColumns(newOptionsInColumns)

        if (onChange) {
            const currentSelectedOptions: Option[] = []

            if (checked === false) {
                updateDisplayValues(onChange, currentSelectedOptions)

                return
            }

            const displayValues = values || unControlledValues

            displayValues.forEach((value) => {
                const option = options.find((item) => item.value === value)

                if (option) currentSelectedOptions.push(option)
            })

            // If select all is checked, the values are displayed in the order
            // in which they are checked
            const selectedOptionInOrder = Array.from(
                new Set([...currentSelectedOptions, ...options])
            )

            updateDisplayValues(onChange, selectedOptionInOrder)
        }
    }

    function handleOptionChange(checkedOption: OptionWithChecked): void {
        // It's not sure if the select all checkbox should be checked
        // So need to count the number of checkboxes that are checked
        let checkedCount = 0
        const checked = checkedOption.checked
        const newOptionsInColumns: OptionWithChecked[][] = []

        optionsInColumns.forEach((optionsInColumn) => {
            const column: OptionWithChecked[] = []

            optionsInColumn.forEach((option) => {
                if (option.value === checkedOption.value) {
                    column.push({ ...option, checked })
                } else {
                    column.push(option)

                    if (option.value !== UNIQUE_SELECT_ALL_VALUE && option.checked)
                        checkedCount++
                }
            })

            newOptionsInColumns.push(column)
        })

        const selectAllOption = newOptionsInColumns[0][0]

        if (checked === false && selectAllOption.checked) {
            selectAllOption.checked = false
        } else if (checked && checkedCount === options.length - 1) {
            selectAllOption.checked = true
        }

        setOptionsInColumns(newOptionsInColumns)

        if (onChange) {
            const currentSelectedOptions: Option[] = []
            const displayValues = values || unControlledValues

            displayValues.forEach((value) => {
                const option = options.find((item) => item.value === value)

                if (option) currentSelectedOptions.push(option)
            })

            const index = currentSelectedOptions.findIndex(
                (item) => item.value === checkedOption.value
            )

            if (index === -1) {
                currentSelectedOptions.push({
                    label: checkedOption.label,
                    value: checkedOption.value,
                })
            } else {
                currentSelectedOptions.splice(index, 1)
            }

            updateDisplayValues(onChange, currentSelectedOptions)
        }
    }

    // update controlled or uncontrolled values
    function updateDisplayValues(
        onChange: (options: Option[]) => void,
        options: Option[]
    ): void {
        onChange(options)

        if (!values) {
            setUnControlledValues(options.map((option) => option.value))
        }
    }

    return (
        <div className="multi-checkboxes">
            <h3 className="multi-checkboxes__label">{label}</h3>
            <div className="multi-checkbox__columns">
                {optionsInColumns.map((optionsInColumn, index) => (
                    <div className="multi-checkboxes__columns--column" key={index}>
                        {optionsInColumn.map((option) => (
                            <Checkbox
                                key={option.value}
                                option={option}
                                onCheckboxChange={handleCheckboxChange}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
