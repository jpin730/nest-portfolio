export const hasAnyProperty = (obj: object): boolean =>
  Object.values(obj).some((value) => value != null)
