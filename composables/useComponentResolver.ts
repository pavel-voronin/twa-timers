export function useComponentResolver(name: string) {
  const originalWarn = console.warn;

  try {
    console.warn = () => {};
    const component = resolveComponent(name);
    return component;
  } catch (e) {
    return null;
  } finally {
    console.warn = originalWarn;
  }
}
