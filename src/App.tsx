import * as React from 'react'

import type { Option } from '@/types'
import { defaultValues, options } from '@/test/data'
import { MultiCheckboxes } from '@/components'

export function App() {
    const [selectedValues, setSelectedValues] =
        React.useState<string[]>(defaultValues)

    function onSelectedOptionsChange(options: Option[]): void {
        setSelectedValues(options.map((it) => it.value))
    }

    return (
        <div>
            <h1>Multi Check Component</h1>
            <MultiCheckboxes
                options={options}
                onChange={onSelectedOptionsChange}
                values={selectedValues}
                columns={4}
            />
            <div>
                <h2>Current selected values:</h2>
                <div>{selectedValues.join(',')}</div>
            </div>
        </div>
    )
}
