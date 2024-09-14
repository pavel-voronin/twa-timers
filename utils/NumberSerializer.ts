export default {
  read: (v: any) => (v !== null ? Number(v) : null), // Convert string to number if not null
  write: (v: any) => String(v), // Store as string in localStorage
};
