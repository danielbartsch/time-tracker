export const padNumber = (number: number, pad: number, zeros: boolean = true): string => {
  if (pad < 1) {
    return String(number)
  }

  const digits = (number === 0 ? 0 : Math.floor(Math.log10(number))) + 1
  return `${Array.from({ length: pad - digits })
    .map(() => (zeros ? '0' : ' '))
    .join('')}${number}`
}
