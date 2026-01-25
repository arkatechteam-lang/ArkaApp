import { Session, User } from "@supabase/supabase-js";
import supabase from "../lib/supabaseClient"
import {
  EmployeeCategory,
  Profile,
  Material,
  Vendor,
  ProcurementInput,
  ProductionEntryInput,
  Order,
  Employee,
  OrderWithLoadmen,
  EmployeeWithCategory
} from './types'
import { MaterialPurchaseInput, ProductionInput } from "../employee/types";

/* ------------------------------------------------------------------
   1. LOGIN
-------------------------------------------------------------------*/

export async function login(
  email: string,
  password: string
): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data.session!;
}

/* ------------------------------------------------------------------
   2. TOKEN VALIDATION
-------------------------------------------------------------------*/

export async function validateSession(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

/* ------------------------------------------------------------------
   3. GET USER PROFILE
-------------------------------------------------------------------*/

export async function getUserProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------
   4. LOGOUT
-------------------------------------------------------------------*/

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/* ------------------------------------------------------------------
   5. GET MATERIALS
-------------------------------------------------------------------*/

export async function getMaterials(): Promise<Material[]> {
  const { data, error } = await supabase
    .from("materials")
    .select("id, name, unit")
    .order("name");

  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------
   6. GET VENDORS
-------------------------------------------------------------------*/

export async function getVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------
   7. CREATE PROCUREMENT
-------------------------------------------------------------------*/

export async function createProcurement(
  input: MaterialPurchaseInput,
  createdBy: string
): Promise<void> {
  const { error } = await supabase.from("procurements").insert({
    ...input,
    approved: false,
    rate_per_unit: 0,
    total_price: 0,
    created_by: createdBy
  });

  if (error) throw error;
}

/* ------------------------------------------------------------------
   8. CREATE PRODUCTION ENTRY
-------------------------------------------------------------------*/

export async function createProductionEntry(
  input: ProductionInput,
  createdBy: string
): Promise<void> {
  const { error } = await supabase.from("production_entries").insert({
    production_date: input.date,
    round: input.round,
    bricks: input.bricks,
    wet_ash_kg: input.wetAsh,
    marble_powder_kg: input.marblePowder,
    crusher_powder_kg: input.crusherPowder,
    fly_ash_kg: input.flyAsh,
    cement_bags: input.cement,
    created_by: createdBy
  });

  if (error) throw error;
}

/* ------------------------------------------------------------------
   9. GET TODAY DELIVERY ORDERS
-------------------------------------------------------------------*/

export async function getTodayDeliveryOrders(): Promise<Order[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customers (
        name,
        phone
      )
    `)
    .eq("delivery_date", today)
    .eq("delivered", false)
    .order("created_at");

  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------
   10. GET LOADMEN (via enum)
-------------------------------------------------------------------*/

export async function getLoadmen(): Promise<EmployeeWithCategory[]> {
  const { data, error } = await supabase
    .from("employees")
    .select(`
      id,
      name,
      phone,
      role_id,
      roles!inner ( category )
    `)
    .eq("roles.category", "LOADMEN" satisfies EmployeeCategory);

  if (error) throw error;
  return data as unknown as EmployeeWithCategory[];
}

/* ------------------------------------------------------------------
   11. GET ORDER WITH LOADMEN
-------------------------------------------------------------------*/

export async function getOrderWithLoadmen(
  orderId: string
): Promise<OrderWithLoadmen> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customers ( name, phone ),
      order_loadmen (
        employees (
          id,
          name,
          phone,
          role_id
        )
      )
    `)
    .eq("id", orderId)
    .single();

  if (error) throw error;

  return {
    ...data,
    loadmen: data.order_loadmen.map(
      (ol: any) => ol.employees
    )
  };
}

/* ------------------------------------------------------------------
   12. UPDATE ORDER + LOADMEN
-------------------------------------------------------------------*/

export async function updateOrderWithLoadmen(
  orderId: string,
  orderUpdate: Partial<Order>,
  newLoadmenIds: string[]
): Promise<void> {
  /* Update order */
  const { error: orderError } = await supabase
    .from("orders")
    .update(orderUpdate)
    .eq("id", orderId);

  if (orderError) throw orderError;

  /* Get existing loadmen */
  const { data: existing } = await supabase
    .from("order_loadmen")
    .select("employee_id")
    .eq("order_id", orderId);

  const existingIds = (existing ?? []).map(e => e.employee_id);

  const toDelete = existingIds.filter(id => !newLoadmenIds.includes(id));
  const toInsert = newLoadmenIds.filter(id => !existingIds.includes(id));

  /* Delete removed loadmen */
  if (toDelete.length > 0) {
    await supabase
      .from("order_loadmen")
      .delete()
      .eq("order_id", orderId)
      .in("employee_id", toDelete);
  }

  /* Insert new loadmen */
  if (toInsert.length > 0) {
    await supabase.from("order_loadmen").insert(
      toInsert.map(employee_id => ({
        order_id: orderId,
        employee_id
      }))
    );
  }
}
