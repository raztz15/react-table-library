export function getOptions(data: any[], key: string) {
    const rolesSet: Set<string> = new Set()
    data.forEach(item => rolesSet.add(item[key]))
    const arr: { optionKey: number, optionVal: string }[] = []
    for (let i = 0; i < rolesSet.size; i++) {
        arr.push({ optionKey: i + 1, optionVal: Array.from(rolesSet)[i] })
    }
    return arr
}

export function isValidDate(dateString: string) {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
}
