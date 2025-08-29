export function splitUnread(by: Record<string, number>) {
  const internal: Record<number, number> = {};
  const external: Record<number, number> = {};
  let externalChannels: number = 0;
  for (const [k, n] of Object.entries(by)) {
    const [kind, idStr] = k.split(":");
    const id = Number(idStr);
    if (kind === "internal") internal[id] = n;
    else if (kind === "external") {
      if (n > 0) externalChannels++;
      external[id] = n;
    }
  }
  const internalTotal = Object.values(internal).reduce((a, b) => a + b, 0);
  const externalTotal = Object.values(external).reduce((a, b) => a + b, 0);
  return { internal, external, internalTotal, externalTotal, externalChannels };
}
