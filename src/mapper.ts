
type InputType = {
    name: string
    age: string
    filters: Array<InputFiltersType>
}

type InputFiltersType = _1_FilterType | _2_FilterType | _3_FilterType

type _1_FilterType = {
    filterType: "FIRST"
    minAmount: string
    maxAmount: string
}

type _2_FilterType = {
    filterType: "SECOND"
    minValue: string
    maxValue: string
}

type _3_FilterType = {
    filterType: "THIRD"
    min: string
    max: string
}

type OutputType = {
    name: string
    age: number
    filters: OutputFiltersType
}

type OutputFiltersType = {
    _1_min: string
    _2_min: string
    _3_min: string
}

const mapper = (input: InputType): OutputType => {
    return {
        name: input.name,
        age: +input.age,
        filters: {
            _1_min: input.filters.find((filter: InputFiltersType) => filter.filterType === "FIRST")!["minAmount"],
            _2_min: input.filters.find((filter: InputFiltersType) => filter.filterType === "SECOND")!["minValue"],
            _3_min: input.filters.find((filter: InputFiltersType) => filter.filterType === "THIRD")!["min"],
        }
    }
}
