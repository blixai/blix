export function getCWDName(): string {
    let rawCWD: string = process.cwd()
    let cwdArr: string[] = rawCWD.split('/')
    let cwdName: string = cwdArr.pop() || ""
    return cwdName
}

export function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

// TODO need a sleep function

export function prettyPath (path: string): string {
   let pathStartCharacters = path.slice(0, 2) 

   if (pathStartCharacters === './') {
       path = path.slice(2)
   }

   return path
}


