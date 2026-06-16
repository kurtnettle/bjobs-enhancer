const debugTag = 'jbd-enhancer'

function debug(...args: any[]) {
  console.debug(`[${debugTag}]`, ...args)
}

function info(...args: any[]) {
  console.info(`[${debugTag}]`, ...args)
}

function warn(...args: any[]) {
  console.warn(`[${debugTag}]`, ...args)
}

function error(...args: any[]) {
  console.error(`[${debugTag}]`, ...args)
}

export {
  debug,
  error,
  info,
  warn,
}
