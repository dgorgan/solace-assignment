export function qsp(p: Record<string, string | number | undefined | null>) {
  const qs = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== "") qs.set(k, String(v));
  });
  return qs.toString();
}
