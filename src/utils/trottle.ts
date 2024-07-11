export const throttle = (func: (...args: any[]) => void, limit: number = 300) => {
  let inThrottle: boolean = false
  return (...args: any[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
