import { Session, User } from "@supabase/supabase-js";
import supabase from "../lib/supabaseClient"
import {
  EmployeeCategory,
  Profile,
  Material,
  Vendor,
  CreateVendorInput,
  ProcurementInput,
  ProductionEntryInput,
  Order,
  Employee,
  OrderWithLoadmen,
  EmployeeWithCategory,
  PaginatedResult,
  Customer,
  CreateLoanInput,
  Account,
  CreateCustomerPaymentInput,
  CreateOrderInput,
  ProductionEntry,
  Loan,
  LoanLedgerItem,
  CreateLoanLedgerInput,
  VendorWithMaterials,
} from './types'
import { MaterialPurchaseInput, ProductionInput } from "../employee/types";
import { getRange, getRangeForProductionStatistics, PAGE_SIZE , mapPaymentModeToDb } from "../utils/reusables";

export const CASH_ACCOUNT_ID = "04f194f4-af1f-4ac0-98be-a5b7f81b449f";

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
   6.1 CREATE VENDOR
-------------------------------------------------------------------*/

export async function createVendor(input: CreateVendorInput): Promise<Vendor> {
  const { data, error } = await supabase
    .from("vendors")
    .insert({
      name: input.name,
      phone: input.phone,
      alternate_phone: input.alternate_phone || null,
      address: input.address,
      gst_number: input.gst_number || null,
      notes: input.notes || null,
    })
    .select()
    .single();

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
    .range(from, to);

  if (error) throw error;

  return {
    data: data ?? [],
    hasMore: count ? to < count - 1 : false,
  };
  }

  /*-----------------------------------------------------------
   21. CREATE ORDERS
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
   22. GET PRODUCTION ENTRIES FROM TODAY WITH PAGINATION
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
    total: count ?? 0,
    hasMore: from + limit < (count ?? 0),
  };
}

/* ------------------------------------------------------------------
   23. CREATE LOANS
-------------------------------------------------------------------*/

export async function createLoanWithDisbursementAndCashEntry(
  input: CreateLoanInput,
  // openCashLedgerDayId: string // currently OPEN cash_ledger_days.id
): Promise<{ loanId: string }> {
  /* -------------------------------------------------------------
     1. DETERMINE PAYMENT MODE
  --------------------------------------------------------------*/
  const paymentMode =
    input.disbursement_account_id === CASH_ACCOUNT_ID
      ? "CASH"
      : "BANK";

  /* -------------------------------------------------------------
     2. CREATE LOAN
  --------------------------------------------------------------*/
  const { data: loan, error: loanError } = await supabase
    .from("loans")
    .insert({
      lender_name: input.lender_name,
      loan_type: input.loan_type,
      principal_amount: input.principal_amount,
      interest_rate: input.interest_rate ?? null,
      outstanding_balance: input.principal_amount,
      disbursement_account_id: input.disbursement_account_id,
      start_date: input.start_date,
      status: "ACTIVE",
      notes: input.notes ?? null,
    })
    .select("id")
    .single();

  if (loanError) throw loanError;

  const loanId = loan.id;

  /* -------------------------------------------------------------
     3. CREATE LOAN LEDGER (DISBURSEMENT)
  --------------------------------------------------------------*/
  const { error: loanLedgerError } = await supabase
    .from("loan_ledger")
    .insert({
      loan_id: loanId,
      transaction_type: "DISBURSEMENT",
      amount: input.principal_amount,
      running_balance: input.principal_amount,
      payment_mode: paymentMode,
      sender_account_id: input.disbursement_account_id,
      receiver_account_info: input.lender_name,
      transaction_date: input.start_date,
      notes: input.notes ?? "Loan disbursement",
    });

  if (loanLedgerError) throw loanLedgerError;

  /* -------------------------------------------------------------
     4. CREATE CASH LEDGER ENTRY (CASH IN)
  --------------------------------------------------------------*/
  // const { error: cashLedgerError } = await supabase
  //   .from("cash_ledger_entries")
  //   .insert({
  //     ledger_day_id: openCashLedgerDayId,
  //     direction: "IN",
  //     source_type: "LOAN_DISBURSEMENT",
  //     account_id: input.disbursement_account_id,
  //     amount: input.principal_amount,
  //     reason: input.notes ?? "Loan disbursement",
  //   });

  // if (cashLedgerError) throw cashLedgerError;

  /* -------------------------------------------------------------
     5. RETURN LOAN ID
  --------------------------------------------------------------*/
  return { loanId };
}


/* ------------------------------------------------------------------
   24. GET ACCOUNTS (for loan disbursement)
-------------------------------------------------------------------*/

export async function getAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select(`
      id,
      account_number,
      opening_balance,
      created_at
    `)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

/* ------------------------------------------------------------------
   25. UPDATE CUSTOMER
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
   26. GET COMPANY ACC FOR CUSTOMER PAYMENTS
-------------------------------------------------------------------*/

export async function getAccountsForPayments() {
  const { data, error } = await supabase
    .from("accounts")
    .select("id, account_number");

  if (error) throw error;
  return data ?? [];
}

/* ------------------------------------------------------------------
   27. CREATE CUSTOMER PAYMENT
-------------------------------------------------------------------*/

export async function createCustomerPayment(
  input: CreateCustomerPaymentInput
) {
  /**
   * 1️⃣ Insert payment
   */
  const dbMode = mapPaymentModeToDb(input.mode);
  const { data: payment, error: insertError } = await supabase
    .from("customer_payments")
    .insert({
      customer_id: input.customer_id,
      payment_date: input.payment_date,
      amount: input.amount,
      mode: dbMode, // MUST be: 'CASH' | 'UPI' | 'BANK' | 'CHEQUE'
      sender_account_no: input.sender_account_no ?? null,
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
   28. GET CUSTOMER PAYMENT
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

/* ------------------------------------------------------------------
   29. GET LOANS
-------------------------------------------------------------------*/

export async function getLoans(): Promise<Loan[]> {
  const { data, error } = await supabase
    .from("loans")
    .select(`
      id,
      lender_name,
      loan_type,
      principal_amount,
      interest_rate,
      outstanding_balance,
      disbursement_account_id,
      start_date,
      status,
      notes,
      created_at
    `)
    // ACTIVE first, then CLOSED
    .order("status", { ascending: true }) // ACTIVE < CLOSED alphabetically
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

/* ------------------------------------------------------------------
   30. GET LOAN LEDGER
-------------------------------------------------------------------*/

export async function getLoanLedger(
  loanId: string,
  page: number
): Promise<PaginatedResult<LoanLedgerItem>> {
  const { from, to } = getRange(page);

  const { data, count, error } = await supabase
    .from("loan_ledger")
    .select(
      `
      id,
      loan_id,
      transaction_type,
      amount,
      running_balance,
      payment_mode,
      sender_account_id,
      receiver_account_info,
      transaction_date,
      notes,
      created_at
      `,
      { count: "exact" }
    )
    .eq("loan_id", loanId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
    hasMore: (from + PAGE_SIZE) < (count ?? 0),
  };
}

/* ------------------------------------------------------------------
   31. GET LOAN BY ID
-------------------------------------------------------------------*/

export async function getLoanById(loanId: string): Promise<Loan> {
  const { data, error } = await supabase
    .from("loans")
    .select(`
      id,
      lender_name,
      loan_type,
      principal_amount,
      interest_rate,
      outstanding_balance,
      disbursement_account_id,
      start_date,
      status,
      notes,
      created_at
    `)
    .eq("id", loanId)
    .single();

  if (error) throw error;

  return data;
}

/* ------------------------------------------------------------------
   31. GET LOAN BY ID
-------------------------------------------------------------------*/

export async function createLoanLedgerTransaction(
  input: CreateLoanLedgerInput
): Promise<{ newBalance: number; loanStatus: "ACTIVE" | "CLOSED" }> {
  /* -------------------------------------------------------------
     1. FETCH CURRENT LOAN BALANCE
  --------------------------------------------------------------*/
  const { data: loan, error: loanError } = await supabase
    .from("loans")
    .select("id, outstanding_balance, status")
    .eq("id", input.loan_id)
    .single();

  if (loanError) throw loanError;

  if (loan.status === "CLOSED") {
    throw new Error("Loan is already closed");
  }

  /* -------------------------------------------------------------
     2. CALCULATE NEW RUNNING BALANCE
  --------------------------------------------------------------*/
  let newBalance = loan.outstanding_balance;

  switch (input.transaction_type) {
    case "DISBURSEMENT":
      newBalance += input.amount;
      break;

    case "REPAYMENT":
      newBalance -= input.amount;
      break;

    case "INTEREST":
      // Interest does NOT affect principal balance
      newBalance = loan.outstanding_balance;
      break;

    default:
      throw new Error("Invalid loan transaction type");
  }

  if (newBalance < 0) {
    throw new Error("Repayment amount exceeds outstanding balance");
  }

  /* -------------------------------------------------------------
     3. INSERT LOAN LEDGER ENTRY
  --------------------------------------------------------------*/
  const { error: ledgerError } = await supabase
    .from("loan_ledger")
    .insert({
      loan_id: input.loan_id,
      transaction_type: input.transaction_type,
      amount: input.amount,
      running_balance: newBalance,
      payment_mode: input.payment_mode,
      sender_account_id: input.sender_account_id,
      receiver_account_info: input.receiver_account_info ?? null,
      transaction_date: input.transaction_date,
      notes: input.notes ?? null,
    });

  if (ledgerError) throw ledgerError;

  /* -------------------------------------------------------------
     4. UPDATE LOAN (BALANCE + STATUS)
  --------------------------------------------------------------*/
  const newStatus = newBalance === 0 ? "CLOSED" : "ACTIVE";

  const { error: updateError } = await supabase
    .from("loans")
    .update({
      outstanding_balance: newBalance,
      status: newStatus,
    })
    .eq("id", input.loan_id);

  if (updateError) throw updateError;

  /* -------------------------------------------------------------
     5. RETURN RESULT
  --------------------------------------------------------------*/
  return {
    newBalance,
    loanStatus: newStatus,
  };
}

/* ------------------------------------------------------------------
   32. CREATE VENDOR WITH MATERIALS
-------------------------------------------------------------------*/

export async function createVendorWithMaterials(
  vendorInput: CreateVendorInput,
  materialIds: string[]
): Promise<{ vendorId: string }> {
  /* -------------------------------------------------------------
     1. CREATE VENDOR
  --------------------------------------------------------------*/
  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .insert({
      name: vendorInput.name,
      phone: vendorInput.phone ?? null,
      alternate_phone: vendorInput.alternate_phone ?? null,
      gst_number: vendorInput.gst_number ?? null,
      address: vendorInput.address ?? null,
      notes: vendorInput.notes ?? null,
    })
    .select("id")
    .single();

  if (vendorError) throw vendorError;

  const vendorId = vendor.id;

  /* -------------------------------------------------------------
     2. CREATE VENDOR ↔ MATERIAL MAPPING
  --------------------------------------------------------------*/
  if (materialIds.length > 0) {
    const rows = materialIds.map((material_id) => ({
      vendor_id: vendorId,
      material_id,
    }));

    const { error: mappingError } = await supabase
      .from("vendor_materials")
      .insert(rows);

    if (mappingError) throw mappingError;
  }

  /* -------------------------------------------------------------
     3. RETURN CREATED VENDOR ID
  --------------------------------------------------------------*/
  return { vendorId };
}

/* ------------------------------------------------------------------
   33. SEARCH VENDORS
-------------------------------------------------------------------*/

export async function searchVendors(
  searchTerm: string,
  page: number
): Promise<PaginatedResult<Vendor>> {
  const { from, to } = getRange(page);

  const trimmed = searchTerm?.trim() ?? "";

  let query = supabase
    .from("vendors")
    .select(
      `
      id,
      name,
      phone,
      alternate_phone,
      gst_number,
      address,
      notes,
      created_at
      `,
      { count: "exact" }
    );

  /* -------------------------------------------------------------
     Apply search only if string is not empty
  --------------------------------------------------------------*/
  if (trimmed.length > 0) {
    query = query.or(`name.ilike.%${trimmed}%,phone.ilike.%${trimmed}%,alternate_phone.ilike.%${trimmed}%`);
  }

  query = query
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
    hasMore: from + PAGE_SIZE < (count ?? 0),
  };
}

/* ------------------------------------------------------------------
   34. GET VENDOR BY ID WITH MATERIALS
-------------------------------------------------------------------*/

export async function getVendorByIdWithMaterials(
  vendorId: string
): Promise<VendorWithMaterials> {
  const { data, error } = await supabase
    .from("vendors")
    .select(`
      id,
      name,
      phone,
      alternate_phone,
      gst_number,
      address,
      notes,
      created_at,
      vendor_materials (
        materials (
          id,
          name,
          unit
        )
      )
    `)
    .eq("id", vendorId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    alternate_phone: data.alternate_phone,
    gst_number: data.gst_number,
    address: data.address,
    notes: data.notes,
    created_at: data.created_at,
    materials: (data.vendor_materials ?? []).map(
      (vm: any) => vm.materials
    ),
  };
}

/* ------------------------------------------------------------------
   35. UPDATE VENDOR WITH MATERIALS
-------------------------------------------------------------------*/

export async function updateVendorWithMaterials(
  vendorId: string,
  vendorInput: CreateVendorInput,
  materialIds: string[]
): Promise<void> {
  /* -------------------------------------------------------------
     1. UPDATE VENDOR
  --------------------------------------------------------------*/
  const { error: vendorError } = await supabase
    .from("vendors")
    .update({
      name: vendorInput.name,
      phone: vendorInput.phone ?? null,
      alternate_phone: vendorInput.alternate_phone ?? null,
      gst_number: vendorInput.gst_number ?? null,
      address: vendorInput.address ?? null,
      notes: vendorInput.notes ?? null,
    })
    .eq("id", vendorId);

  if (vendorError) throw vendorError;

  /* -------------------------------------------------------------
     2. GET EXISTING MATERIALS
  --------------------------------------------------------------*/
  const { data: existingMaterials } = await supabase
    .from("vendor_materials")
    .select("material_id")
    .eq("vendor_id", vendorId);

  const existingIds = (existingMaterials ?? []).map((vm) => vm.material_id);

  /* -------------------------------------------------------------
     3. DETERMINE CHANGES
  --------------------------------------------------------------*/
  const toDelete = existingIds.filter((id) => !materialIds.includes(id));
  const toInsert = materialIds.filter((id) => !existingIds.includes(id));

  /* -------------------------------------------------------------
     4. DELETE REMOVED MATERIALS
  --------------------------------------------------------------*/
  if (toDelete.length > 0) {
    await supabase
      .from("vendor_materials")
      .delete()
      .eq("vendor_id", vendorId)
      .in("material_id", toDelete);
  }

  /* -------------------------------------------------------------
     5. INSERT NEW MATERIALS
  --------------------------------------------------------------*/
  if (toInsert.length > 0) {
    const rows = toInsert.map((material_id) => ({
      vendor_id: vendorId,
      material_id,
    }));

    const { error: insertError } = await supabase
      .from("vendor_materials")
      .insert(rows);

    if (insertError) throw insertError;
  }
}

/* ------------------------------------------------------------------
   36. GET EXPENSE TYPES
-------------------------------------------------------------------*/
export async function getExpenseTypes() {
  const { data, error } = await supabase
    .from("expense_types")
    .select("*")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

/* ------------------------------------------------------------------
   37. CREATE EXPENSE TYPE
-------------------------------------------------------------------*/
export async function createExpenseType(name: string) {
  const { data, error } = await supabase
    .from("expense_types")
    .insert([{ name }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------
   38. GET EXPENSE SUBTYPES
-------------------------------------------------------------------*/
export async function getExpenseSubtypes(typeId: string) {
  const { data, error } = await supabase
    .from("expense_subtypes")
    .select("*")
    .eq("type_id", typeId)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

/* ------------------------------------------------------------------
   39. CREATE EXPENSE SUBTYPE
-------------------------------------------------------------------*/
export async function createExpenseSubtype(
  typeId: string,
  name: string
) {
  const { data, error } = await supabase
    .from("expense_subtypes")
    .insert([{ type_id: typeId, name }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------
   40. CREATE EXPENSE
-------------------------------------------------------------------*/
export async function createExpense(payload: {
  expense_date: string;
  type_id: string;
  subtype_id: string;
  amount: number;
  payment_mode: "CASH" | "UPI" | "BANK" | "CHEQUE";
  sender_account_id?: string;
  comments?: string;
}) {
  // 1️⃣ Decide which account to deduct from
  let accountIdToDeduct: string | undefined;

  if (payload.payment_mode === "CASH") {
    const cashAccount = await getCashAccount();
    accountIdToDeduct = cashAccount.id;
  } else {
    accountIdToDeduct = payload.sender_account_id;
  }

  if (!accountIdToDeduct) {
    throw new Error("Account not found for deduction");
  }

  // 2️⃣ Deduct balance FIRST (before inserting expense)
  // This validates balance and throws error if insufficient
  const { error: rpcError } = await supabase.rpc(
    "decrement_account_balance",
    {
      p_account_id: accountIdToDeduct,
      p_amount: payload.amount,
    }
  );

  if (rpcError) throw rpcError;

  // 3️⃣ Only insert expense if balance deduction was successful
  const { data, error } = await supabase
    .from("expenses")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* ------------------------------------------------------------------
   41. GET ORDERS BY DATE RANGE (for Accounts/Income reporting)
-------------------------------------------------------------------*/
export async function getOrdersByDateRange(
  startDate: string,
  endDate: string
): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customers (
        name,
        phone
      )
    `)
    .gte("order_date", startDate)
    .lte("order_date", endDate)
    .order("order_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/* ------------------------------------------------------------------
   42. GET EXPENSES BY DATE RANGE (for Accounts/Expenses reporting)
-------------------------------------------------------------------*/
export async function getExpensesByDateRange(
  startDate: string,
  endDate: string
): Promise<any[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select(`
      *,
      expense_types (
        id,
        name
      ),
      expense_subtypes (
        id,
        name
      ),
      accounts (
        id,
        account_number
      )
    `)
    .gte("expense_date", startDate)
    .lte("expense_date", endDate)
    .order("expense_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/* ------------------------------------------------------------------
   43. GET CASH ACCOUNT SAI
-------------------------------------------------------------------*/
export async function getCashAccount() {
  const { data, error } = await supabase
    .from("accounts")
    .select("id")
    .ilike("account_number", "Cash")
    .single();

  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------
   44. GET ACTIVE EMPLOYEES WITH ROLE AND CATEGORY
-------------------------------------------------------------------*/
export async function getActiveEmployees(
  searchTerm: string,
  page: number
): Promise<PaginatedResult<EmployeeWithCategory>> {
  const { from, to } = getRange(page);

  const trimmed = searchTerm?.trim() ?? "";

  let query = supabase
    .from("employees")
    .select(
      `
      id,
      name,
      phone,
      role_id,
      active,
      roles ( id, name, category )
      `,
      { count: "exact" }
    )
    .eq("active", true);

  /* Apply search only if string is not empty */
  if (trimmed.length > 0) {
    query = query.or(
      `name.ilike.%${trimmed}%,phone.ilike.%${trimmed}%`
    );
  }

  query = query
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    data: (data ?? []) as unknown as EmployeeWithCategory[],
    total: count ?? 0,
    hasMore: from + PAGE_SIZE < (count ?? 0),
  };
}

/* ------------------------------------------------------------------
   45. GET INACTIVE EMPLOYEES WITH ROLE AND CATEGORY
-------------------------------------------------------------------*/
export async function getInactiveEmployees(
  searchTerm: string,
  page: number
): Promise<PaginatedResult<EmployeeWithCategory>> {
  const { from, to } = getRange(page);

  const trimmed = searchTerm?.trim() ?? "";

  let query = supabase
    .from("employees")
    .select(
      `
      id,
      name,
      phone,
      role_id,
      active,
      roles ( id, name, category )
      `,
      { count: "exact" }
    )
    .eq("active", false);

  /* Apply search only if string is not empty */
  if (trimmed.length > 0) {
    query = query.or(
      `name.ilike.%${trimmed}%,phone.ilike.%${trimmed}%`
    );
  }

  query = query
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    data: (data ?? []) as unknown as EmployeeWithCategory[],
    total: count ?? 0,
    hasMore: from + PAGE_SIZE < (count ?? 0),
  };
}

/* ------------------------------------------------------------------
   46. UPDATE EMPLOYEE STATUS (ACTIVE/INACTIVE)
-------------------------------------------------------------------*/
export async function updateEmployeeStatus(
  employeeId: string,
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from("employees")
    .update({ active: isActive })
    .eq("id", employeeId);

  if (error) throw error;
}

/* ------------------------------------------------------------------
   47. PROCUREMENT FUNCTIONS
-------------------------------------------------------------------*/

export interface ProcurementWithDetails {
  id: string;
  material_id: string;
  vendor_id: string;
  quantity: number;
  rate_per_unit: number;
  total_price: number;
  date: string;
  approved: boolean;
  created_by: string;
  created_at: string;
  materials?: {
    id: string;
    name: string;
    unit: string;
  };
  vendors?: {
    id: string;
    name: string;
    phone: string | null;
  };
}

/*-----------------------------------------------------------------------
 * 47.1 Get unapproved procurements
 * Fetch all unapproved procurements (no date range filter)
 * Used in UnapprovedProcurementsScreen
-------------------------------------------------------------------------- */
export async function getUnapprovedProcurements(): Promise<ProcurementWithDetails[]> {
  const { data, error } = await supabase
    .from("procurements")
    .select(`
      id,
      material_id,
      vendor_id,
      quantity,
      rate_per_unit,
      total_price,
      date,
      approved,
      created_by,
      created_at,
      materials!material_id(id, name, unit),
      vendors!vendor_id(id, name, phone)
    `)
    .eq("approved", false)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching procurements:", error);
    throw error;
  }
  return (data as unknown as ProcurementWithDetails[]) ?? [];
}

/**--------------------------------------------------------------------------
 * 47.2 Get unapproved procurements count
 * Get count of ALL unapproved procurements (no date range filter)
 * Used in InventoryManagementScreen - shows total unapproved count
------------------------------------------------------------------------------ */
export async function getUnapprovedProcurementCount(): Promise<number> {
  const { count, error } = await supabase
    .from("procurements")
    .select("id", { count: "exact", head: true })
    .eq("approved", false);

  if (error) throw error;
  return count ?? 0;
}

/**------------------------------------------------------------------------------
 * 47.3 Update inventory stock when procurement is approved
 * Helper function to add/update material quantity in inventory_stock table
------------------------------------------------------------------------------ */
async function updateInventoryStock(
  materialId: string,
  quantity: number
): Promise<void> {
  // First, check if the material already exists in inventory_stock
  const { data: existingStock, error: fetchError } = await supabase
    .from("inventory_stock")
    .select("*")
    .eq("material_id", materialId);

  if (fetchError) {
    throw fetchError;
  }

  if (existingStock && existingStock.length > 0) {
    // Material exists, update the quantity
    const currentStock = existingStock[0];
    const { error: updateError } = await supabase
      .from("inventory_stock")
      .update({
        quantity: currentStock.quantity + quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("material_id", materialId);

    if (updateError) throw updateError;
  } else {
    // Material doesn't exist, create new record
    const { error: insertError } = await supabase
      .from("inventory_stock")
      .insert({
        material_id: materialId,
        quantity: quantity,
        updated_at: new Date().toISOString(),
      });

    if (insertError) throw insertError;
  }
}

/**------------------------------------------------------------------------------
 * 47.4 Convert quantity to KG based on material type
 * Handles unit conversion for different materials:
 * - Cement: Bags to KG (1 bag = 50 kg)
 * - Crusher Powder: Units to KG (1 unit = 4500 kg)
 * - Others (Wet Ash, Marble, Fly Ash): Tons to KG (1 ton = 1000 kg)
------------------------------------------------------------------------------ */
function convertToKg(materialName: string, quantity: number): number {
  const name = materialName.toLowerCase();
  
  if (name.includes('cement')) {
    // 1 bag = 50 kg
    return quantity * 50;
  } else if (name.includes('crusher')) {
    // 1 unit = 4500 kg
    return quantity * 4500;
  }
  // Wet Ash, Marble Powder, Fly Ash are in tons, convert to kg
  // 1 ton = 1000 kg
  return quantity * 1000;
}

/**------------------------------------------------------------------------------
 * 47.5 Approve procurement
 * Update procurement approval status, rate, and total price
 * Automatically converts quantity to KG and updates inventory_stock
------------------------------------------------------------------------------ */
export async function approveProcurement(
  procurementId: string,
  ratePerUnit: number,
  totalPrice: number
): Promise<void> {
  // First, get the procurement details to access material_id, quantity, and material name
  const { data: procurement, error: fetchError } = await supabase
    .from("procurements")
    .select("material_id, quantity, materials!material_id(name)")
    .eq("id", procurementId)
    .single();

  if (fetchError) throw fetchError;
  if (!procurement) throw new Error("Procurement not found");

  // Update procurement approval status
  const { error: updateError } = await supabase
    .from("procurements")
    .update({
      approved: true,
      rate_per_unit: ratePerUnit,
      total_price: totalPrice,
    })
    .eq("id", procurementId);

  if (updateError) throw updateError;

  // Convert quantity to KG based on material type
  const material = Array.isArray(procurement.materials) 
    ? procurement.materials[0] 
    : procurement.materials;
  const materialName = material?.name || '';
  const quantityInKg = convertToKg(materialName, procurement.quantity);

  // Update inventory stock for the material (store in KG)
  await updateInventoryStock(procurement.material_id, quantityInKg);
}

/**------------------------------------------------------------------------------
 * 47.6 Get inventory stock for all materials or specific material
 * Fetch inventory stock with material details
------------------------------------------------------------------------------ */
export async function getInventoryStock(materialId?: string): Promise<any[]> {
  let query = supabase
    .from("inventory_stock")
    .select(`
      material_id,
      quantity,
      updated_at,
      materials!material_id(id, name, unit)
    `)
    .order("updated_at", { ascending: false });

  if (materialId) {
    query = query.eq("material_id", materialId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

/**------------------------------------------------------------------------------
 * 47.7 Get inventory stock for specific material
 * Fetch inventory stock details for a single material by ID
------------------------------------------------------------------------------ */
export async function getInventoryStockForMaterial(materialId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from("inventory_stock")
    .select(`
      material_id,
      quantity,
      updated_at,
      materials!material_id(id, name, unit)
    `)
    .eq("material_id", materialId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data ?? null;
}

/**
 * 47.8 Get all approved procurements
 * Fetch all procurements that have been approved with material and vendor details
 * Used in InventoryManagementScreen - Procurement tab
 */
export async function getProcurements(): Promise<any[]> {
  const { data, error } = await supabase
    .from("procurements")
    .select(`
      id,
      material_id,
      vendor_id,
      quantity,
      rate_per_unit,
      total_price,
      date,
      approved,
      created_by,
      created_at,
      materials!material_id(id, name, unit),
      vendors!vendor_id(id, name, phone)
    `)
    .eq("approved", true)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching procurements:", error);
    throw error;
  }
  return data ?? [];
}

/**
 * 47.9 Get all production entries
 * Fetch all production entries with material usage details
 * Used in InventoryManagementScreen - Usage tab
 */
export async function getProductionEntries(): Promise<any[]> {
  const { data, error } = await supabase
    .from("production_entries")
    .select(`
      id,
      production_date,
      bricks,
      round,
      wet_ash_kg,
      marble_powder_kg,
      crusher_powder_kg,
      fly_ash_kg,
      cement_bags,
      created_by,
      created_at
    `)
    .order("production_date", { ascending: false });

  if (error) {
    console.error("Error fetching production entries:", error);
    throw error;
  }
  return data ?? [];
}
