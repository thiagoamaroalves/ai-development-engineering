const forbidden = /\/(?:src\/infrastructure|src\/transport|prototype|\.pi)(?:\/|$)/i

export async function resolve(specifier, context, defaultResolve) {
  const resolved = await defaultResolve(specifier, context, defaultResolve)
  if (forbidden.test(new URL(resolved.url).pathname)) {
    throw new Error(`EXEC registry import boundary rejected forbidden module: ${resolved.url}`)
  }
  return resolved
}
