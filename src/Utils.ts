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

export function formatDate(str: string, saperator: string = '.') {
    const splittedDate = str.split('-')
    let formattedDate = ''
    for (let i = splittedDate.length - 1; i >= 0; i--) {
        formattedDate += (splittedDate[i] + (i > 0 ? saperator : ''))
    }
    return formattedDate
}
