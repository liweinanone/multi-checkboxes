import './checkbox.css'

import * as React from 'react'

import type { OptionWithChecked } from '@/types'

interface CheckboxProps {
    option: OptionWithChecked
    onCheckboxChange: (option: OptionWithChecked) => void
}

export function Checkbox({ option, onCheckboxChange }: CheckboxProps): JSX.Element {
    return (
        <div className="checkbox">
            <input
                type="checkbox"
                id={option.label}
                value={option.value}
                checked={option.checked}
                onChange={() =>
                    onCheckboxChange({ ...option, checked: !option.checked })
                }
            />
            <label htmlFor={option.label}>{option.label}</label>
        </div>
    )
}
