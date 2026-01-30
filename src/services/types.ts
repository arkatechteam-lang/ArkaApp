/* ------------------------------------------------------------------
   TYPES (derived from schema)
-------------------------------------------------------------------*/

export type UserRole = "ADMIN" | "EMPLOYEE";
export type EmployeeCategory = "DAILY" | "FIXED" | "LOADMEN";

export interface Profile {
  id: string;
  phone: string;
  role: UserRole;
}

export interface Material {
  id: string;
  name: string;
  unit: string;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string | null;
  alternate_phone: string | null;
}

export interface ProcurementInput {
  material_id: string;
  vendor_id: string;
  quantity: number;
  rate_per_unit: number;
  total_price: number;
  date: string;
}

export interface ProductionEntryInput {
  production_date: string;
  bricks: number;
  round: number;
  wet_ash_kg?: number;
  marble_powder_kg?: number;
  crusher_powder_kg?: number;
  fly_ash_kg?: number;
  cement_bags?: number;
}

export type PaymentStatus =
  | "NOT_PAID"
  | "PARTIALLY_PAID"
  | "FULLY_PAID";

export interface OrderCustomer {
  name: string;
  phone: string;
}

export interface Order {
  id: string;
  customer_id: string;
  order_date: string;
  delivery_date: string;
  brick_quantity: number;
  price_per_brick: number | null;
  paper_price: number | null;
  final_price: number;
  location: string;
  payment_status: PaymentStatus;
  amount_paid: number;
  gst_number: string | null;
  dc_number: string | null;
  delivered: boolean;
  created_by: string;
  created_at: string;
  customers?: OrderCustomer;
  time: string | null;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  role_id: string;
}

export interface OrderWithLoadmen extends Order {
  loadmen?: Employee[];
}

export interface EmployeeWithCategory extends Employee {
  roles: {
    category: EmployeeCategory;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;      // total matching rows
  hasMore: boolean;   // for "Load more" visibility
}
