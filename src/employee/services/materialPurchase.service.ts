import { MaterialPurchaseInput, Vendor } from "../types";

/**
 * TEMP MOCK — replace with Supabase later
 */
export async function fetchVendors(): Promise<Vendor[]> {
  await new Promise((r) => setTimeout(r, 300));

  return [
    { id: "V-001", name: "ABC Suppliers" },
    { id: "V-002", name: "XYZ Materials" },
    { id: "V-003", name: "Prime Vendors" },
    { id: "V-004", name: "Best Quality Co." },
    { id: "V-005", name: "Reliable Suppliers" },
  ];
}

/**
 * TEMP MOCK — replace with Supabase insert later
 */
export async function createMaterialPurchase(
  payload: MaterialPurchaseInput
) {
  console.log("Material purchase payload:", payload);

  await new Promise((r) => setTimeout(r, 700));
  return { success: true };
}
