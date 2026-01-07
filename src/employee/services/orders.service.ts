import { Order } from "../types";

/**
 * Fetch undelivered orders
 * TEMP: mocked
 * TODO: replace with Supabase query
 */
export async function fetchUndeliveredOrders(): Promise<Order[]> {
  return [
    {
      id: "ORD-001",
      customerName: "Rajesh Kumar",
      customerNumber: "9876543210",
      location: "123 MG Road, Bangalore",
      quantity: 50000,
      amount: 5000000,
    },
    {
      id: "ORD-002",
      customerName: "Priya Sharma",
      customerNumber: "9876543211",
      location: "456 Brigade Road, Bangalore",
      quantity: 3000,
      amount: 30000,
    },
    {
      id: "ORD-003",
      customerName: "Amit Patel",
      customerNumber: "9876543212",
      location: "789 Koramangala, Bangalore",
      quantity: 7500,
      amount: 75000,
    },
    {
      id: "ORD-004",
      customerName: "Sunita Reddy",
      customerNumber: "9876543213",
      location: "321 Indiranagar, Bangalore",
      quantity: 4000,
      amount: 40000,
    },
    {
      id: "ORD-005",
      customerName: "Vijay Singh",
      customerNumber: "9876543214",
      location: "654 Whitefield, Bangalore",
      quantity: 6000,
      amount: 60000,
    },
  ];
}
