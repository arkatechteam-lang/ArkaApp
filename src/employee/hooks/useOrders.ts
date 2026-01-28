import { useEffect, useState } from "react";
import { getTodayDeliveryOrders } from "../../services/middleware.service";
import { Order } from "../../services/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getTodayDelivery() {
    try {
      const orders = await getTodayDeliveryOrders();
      console.log("Fetched orders:", orders);
      setOrders(orders);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTodayDelivery();
  }, []);

  return { orders, loading, error };
}
