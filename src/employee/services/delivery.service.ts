import { DeliveryInput, DeliveryResponse } from "../types";

/**
 * Create a delivery entry
 * TEMP: mocked implementation
 * TODO: replace internals with Supabase insert
 */
export async function createDelivery(
  payload: DeliveryInput
): Promise<DeliveryResponse> {
  console.log("Mock createDelivery payload:", payload);

  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
    message: "Delivery recorded successfully",
  };
}

/**
 * Fetch delivery details (future use)
 * TODO: replace with Supabase select
 */
export async function getDeliveryByOrderId(orderId: string) {
  console.log("Mock getDeliveryByOrderId:", orderId);

  return null;
}
