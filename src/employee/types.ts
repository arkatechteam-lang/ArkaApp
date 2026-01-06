export interface Order {
  id: string;
  customerName: string;
  customerNumber: string;
  location: string;
  quantity: number;
  amount: number;
}

export type PaymentStatus = "Pending" | "Partially paid" | "Fully paid";

export interface DeliveryInput {
  orderId: string;
  date: string;
  time: string;
  quantity: number;
  paymentStatus: PaymentStatus;
  paidAmount?: number;
  gstNumber?: string;
  deliveryChallanNumber: string;
  loadMen: string[];
}

export interface DeliveryResponse {
  success: boolean;
  message: string;
}

export interface LoadMan {
  id: string;
  name: string;
}

export type Material =
  | "Wet Ash"
  | "Marble Powder"
  | "Crusher Powder"
  | "Fly Ash Powder"
  | "Cement";

export interface Vendor {
  id: string;
  name: string;
}

export interface MaterialPurchaseInput {
  material: Material;
  vendorId: string;
  quantity: number;
  date: string;
}

export interface ProductionInput {
  date: string;
  round: number;
  bricks: number;
  wetAsh: number;
  marblePowder: number;
  crusherPowder: number;
  flyAsh: number;
  cement: number;
}