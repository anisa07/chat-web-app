export const debounce = (fn: (...args: any[]) => void, wait: number = 300) => {
  let timer: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}
