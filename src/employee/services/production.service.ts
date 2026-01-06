import { ProductionInput } from "../types";

/**
 * TEMP MOCK — replace with Supabase later
 */
export async function createProductionEntry(
  payload: ProductionInput)
 {
  console.log("Production entry payload:", payload);

  // simulate API delay
  await new Promise((r) => setTimeout(r, 800));

  return { success: true };
}
