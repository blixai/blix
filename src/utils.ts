export function getCWDName(): string {
    let rawCWD: string = process.cwd()
    let cwdArr: string[] = rawCWD.split('/')
    let cwdName: string = cwdArr.pop() || ""
    return cwdName
}

export function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1)
}
    // need a sleep function
