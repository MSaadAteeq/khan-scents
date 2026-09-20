/** Mask email in server logs — e.g. s***@gmail.com */
export function maskEmail(email) {
  if (!email || !email.includes("@")) return "[redacted]";
  const [local, domain] = email.split("@");
  const masked = local.length <= 1 ? "*" : `${local[0]}***`;
  return `${masked}@${domain}`;
}

/** Public order response — no address/phone in API body */
export function formatOrderPublic(order, { emailSent } = {}) {
  return {
    id: order.orderId,
    status: order.status,
    total: order.total,
    emailSent: Boolean(emailSent),
  };
}
