import { MaterialPurchaseInput } from "../types";

export function validateMaterialPurchase(input: MaterialPurchaseInput) {
  const errors: Record<string, string> = {};

  if (!input.material) errors.material = "Material is required";
  if (!input.vendorId) errors.vendor = "Vendor is required";
  if (!input.quantity || input.quantity <= 0)
    errors.quantity = "Quantity is required";
  if (!input.date) errors.date = "Date is required";

  return errors;
}
