export function validateCustomer(input: {
  name: string;
  phone: string;
  address: string;
  gst_number?: string;
}) {
  const errors: Record<string, string> = {};

  if (!input.name.trim()) errors.name = "Name is required";

  if (!/^[6-9]\d{9}$/.test(input.phone))
    errors.phone = "Enter valid 10-digit phone number";

  if (!input.address.trim())
    errors.address = "Address is required";

  if (input.gst_number && input.gst_number.length !== 15)
    errors.gst_number = "Invalid GST number";

  return errors;
}
