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
  EmployeeWithCategory,
  PaginatedResult,
  Customer,
  CreateCustomerPaymentInput
  CreateOrderInput,
  ProductionEntry
} from './types'
import { MaterialPurchaseInput, ProductionInput } from "../employee/types";
import { getRange, getRangeForProductionStatistics, PAGE_SIZE , mapPaymentModeToDb } from "../utils/reusables";

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
   6.5 SEARCH CUSTOMERS
-------------------------------------------------------------------*/

export async function searchCustomers(searchTerm: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
    .order("name");

  if (error) throw error;
  return data ?? [];
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

/* ------------------------------------------------------------------
   13. GET TODAY DELIVERY ORDERS WITH PAGINATION
-------------------------------------------------------------------*/

export async function getTodayDeliveryOrdersWithPagination(
  page: number
): Promise<PaginatedResult<Order>> {
  const today = new Date().toISOString().split("T")[0];
  const { from, to } = getRange(page);

  const { data, count, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customers (
        name,
        phone
      )
      `,
      { count: "exact" }
    )
    .eq("delivery_date", today)
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
    hasMore: (from + PAGE_SIZE) < (count ?? 0),
  };
}

/* ------------------------------------------------------------------
   14. GET UNDELIVERED ORDERS WITH PAGINATION
-------------------------------------------------------------------*/

export async function getUndeliveredOrders(
  page: number
): Promise<PaginatedResult<Order>> {
  const { from, to } = getRange(page);

  const { data, count, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customers ( name, phone )
      `,
      { count: "exact" }
    )
    .eq("delivered", false)
    .range(from, to)
    .order("delivery_date", { ascending: true });

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
    hasMore: (from + PAGE_SIZE) < (count ?? 0),
  };
}

/* ------------------------------------------------------------------
   15. GET DELIVERED ORDERS WITH PAGINATION
-------------------------------------------------------------------*/

export async function getDeliveredOrders(
  page: number
): Promise<PaginatedResult<Order>> {
  const { from, to } = getRange(page);

  const { data, count, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customers ( name, phone )
      `,
      { count: "exact" }
    )
    .eq("delivered", true)
    .range(from, to)
    .order("delivery_date", { ascending: false });

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
    hasMore: (from + PAGE_SIZE) < (count ?? 0),
  };
}

/* ------------------------------------------------------------------
   16. GET UNPAID ORDERS WITH PAGINATION
-------------------------------------------------------------------*/

export async function getUnpaidOrders(
  page: number
): Promise<PaginatedResult<Order>> {
  const { from, to } = getRange(page);

  const { data, count, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customers ( name, phone )
      `,
      { count: "exact" }
    )
    .eq("delivered", true)
    .in("payment_status", ["NOT_PAID", "PARTIALLY_PAID"])
    .range(from, to)
    .order("delivery_date", { ascending: true });

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
    hasMore: (from + PAGE_SIZE) < (count ?? 0),
  };
}

/* ------------------------------------------------------------------
   17. GET CUSTOMERS WITH PAGINATION
-------------------------------------------------------------------*/

export async function getCustomersWithFinancials(
  page = 1,
  search?: string
) {
  const PAGE_SIZE = 20;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("customer_financials")
    .select("*", { count: "exact" })
    .order("name");

  if (search && search.trim().length >= 2) {
    query = query.or(
      `name.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return {
    data: data ?? [],
    hasMore: count ? to < count - 1 : false,
  };
}



/* ------------------------------------------------------------------
   18. GET CUSTOMER BY ID
-------------------------------------------------------------------*/

export async function getCustomerFinancialById(customerId: string) {
  const { data, error } = await supabase
    .from("customer_financials")
    .select("*")
    .eq("customer_id", customerId)
    .single();

  if (error) throw error;
  return data;
}


/* ------------------------------------------------------------------
   19. CREATE CUSTOMER
-------------------------------------------------------------------*/

export async function createCustomer(input: {
  name: string;
  phone: string;
  address: string;
  gst_number?: string;
}): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert({
  name: input.name,
  phone: input.phone,
  address: input.address,
  gst_number: input.gst_number ?? null,
})
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------
   20. GET ORDERS BY CUSTOMER
-------------------------------------------------------------------*/

export async function getCustomerOrdersWithSettlement(
  customerId: string,
  page = 1
) {
  const PAGE_SIZE = 20;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("customer_order_settlement")
    .select(
      `
        order_id,
        customer_id,
        order_date,
        delivery_date,
        brick_quantity,
        final_price,
        gst_number,
        dc_number,
        total_paid,
        remaining_balance,
        payment_status
      `,
      { count: "exact" }
    )
    .eq("customer_id", customerId)
    .order("order_date", { ascending: true })
  */-----------------------------------------------------------
   17. CREATE ORDERS
-------------------------------------------------------------------*/

export async function createOrder(
  orderInput: CreateOrderInput,
  loadmenIds: string[],
  createdBy: string
): Promise<{ orderId: string }> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      ...orderInput,
      delivered: false,
      created_by: createdBy,
    })
    .select("id")
    .single();

  if (orderError) throw orderError;

  const orderId = order.id;

  if (loadmenIds.length > 0) {
    const loadmenRows = loadmenIds.map((employee_id) => ({
      order_id: orderId,
      employee_id,
    }));

    const { error: loadmenError } = await supabase
      .from("order_loadmen")
      .insert(loadmenRows);

    if (loadmenError) throw loadmenError;
  }
  return { orderId };
}

/* ------------------------------------------------------------------
   16. GET PRODUCTION ENTRIES FROM TODAY WITH PAGINATION
-------------------------------------------------------------------*/

export async function getProductionEntriesFromToday(
  page: number
): Promise<PaginatedResult<ProductionEntry>> {
  const today = new Date().toISOString().split("T")[0];
  const { from, to, limit } = getRangeForProductionStatistics(page);

  const { data, count, error } = await supabase
    .from("production_entries")
    .select(
      `
      id,
      production_date,
      round,
      bricks,
      wet_ash_kg,
      marble_powder_kg,
      crusher_powder_kg,
      fly_ash_kg,
      cement_bags,
      created_at
      `,
      { count: "exact" }
    )
    .lte("production_date", today)
    .order("production_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: data ?? [],
    hasMore: count ? to < count - 1 : false,
  };
}

/* ------------------------------------------------------------------
   21. UPDATE CUSTOMER
-------------------------------------------------------------------*/

export async function updateCustomer(
  customerId: string,
  input: {
    name: string;
    phone: string;
    address: string;
    gst_number?: string;
  }
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .update({
      name: input.name,
      phone: input.phone,
      address: input.address,
      gst_number: input.gst_number ?? null,
    })
    .eq("id", customerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------
   22. GET COMPANY ACC FOR CUSTOMER PAYMENTS
-------------------------------------------------------------------*/

export async function getAccountsForPayments() {
  const { data, error } = await supabase
    .from("accounts")
    .select("id, account_number");

  if (error) throw error;
  return data ?? [];
}

/* ------------------------------------------------------------------
   23. CREATE CUSTOMER PAYMENT
-------------------------------------------------------------------*/

export async function createCustomerPayment(
  input: CreateCustomerPaymentInput
) {
  /**
   * 1️⃣ Insert payment
   */
  const { data: payment, error: insertError } = await supabase
    .from("customer_payments")
    .insert({
      customer_id: input.customer_id,
      payment_date: input.payment_date,
      amount: input.amount,
      mode: input.mode, // MUST be: 'CASH' | 'UPI' | 'BANK' | 'CHEQUE'
      sender_account_id: input.sender_account_id ?? null,
      receiver_account_id: input.receiver_account_id,
    })
    .select()
    .single();

  if (insertError) throw insertError;

  /**
   * 2️⃣ Apply FIFO settlement
   */
  const { error: fifoError } = await supabase.rpc(
    "apply_customer_payment_fifo",
    {
      p_customer_id: input.customer_id,
      p_payment_id: payment.id,
      p_amount: input.amount,
    }
  );

  if (fifoError) throw fifoError;

  /**
   * 3️⃣ Increment account balance
   */
  const { error: accountError } = await supabase.rpc(
    "increment_account_balance",
    {
      p_account_id: input.receiver_account_id,
      p_amount: input.amount,
    }
  );

  if (accountError) throw accountError;

  return payment;
}



/* ------------------------------------------------------------------
   24. GET CUSTOMER PAYMENT
-------------------------------------------------------------------*/

export async function getCustomerPayments(
  customerId: string,
  page = 1
) {
  const PAGE_SIZE = 20;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("customer_payments_view")
    .select("*", { count: "exact" })
    .eq("customer_id", customerId)
    .range(from, to);

  if (error) throw error;

  return {
    data: data ?? [],
    hasMore: count ? to < count - 1 : false,
  };
}
    total: count ?? 0,
    hasMore: from + limit < (count ?? 0),
  };
}



