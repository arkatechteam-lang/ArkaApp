import type { CreateVendorInput } from '../../services/types';

export function validateCreateVendor(
  input: CreateVendorInput,
  materialIds: string[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Vendor Name validation
  if (!input.name.trim()) {
    errors.name = 'Vendor name is required';
  }

  // Phone Number validation
  if (!input.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[0-9]{10}$/.test(input.phone)) {
    errors.phone = 'Phone number must be 10 digits';
  }

  // Alternate Phone validation (optional, but must be valid if provided)
  if (input.alternate_phone && !/^[0-9]{10}$/.test(input.alternate_phone)) {
    errors.alternate_phone = 'Alternate phone must be 10 digits';
  }

  // Materials validation
  if (!materialIds || materialIds.length === 0) {
    errors.material_ids = 'Select at least one material';
  }

  // Address validation
  if (!input.address.trim()) {
    errors.address = 'Address is required';
  }

  return errors;
}
