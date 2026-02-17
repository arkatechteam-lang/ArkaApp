import React from "react";
interface ExportCustomer {
  name: string;
  phoneNumber: string;
  address: string;
}

interface ExportOrder {
  id: string;
  date: string;
  quantity: number;
  finalPrice: number;
}

interface ExportPayment {
  id: string;
  date: string;
  amount: number;
  modeOfPayment: string;
}

interface CustomerLedgerExportProps {
  customer: ExportCustomer;
  orders: ExportOrder[];
  payments: ExportPayment[];
  fromDate: string;
  toDate: string;
}

export const CustomerLedgerExport = React.forwardRef<HTMLDivElement, CustomerLedgerExportProps>(
  ({ customer, orders, payments, fromDate, toDate }, ref) => {
    const totalOrders = (orders ?? []).reduce(
  (sum, o) => sum + (o.finalPrice ?? 0),
  0
);

const totalPayments = (payments ?? []).reduce(
  (sum, p) => sum + (p.amount ?? 0),
  0
);

    const outstanding = totalOrders - totalPayments;

    return (
      <div
        ref={ref}
        style={{
          padding: "40px",
          width: "1000px",
          background: "white",
          fontFamily: "Arial",
          color: "#000",
        }}
      >
        {/* Header */}
        <h1 style={{ textAlign: "center", marginBottom: "5px" }}>
          ARKA BRICKS
        </h1>

        <hr />

        {/* Customer Info */}
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <p><strong>Customer:</strong> {customer.name}</p>
          <p><strong>Phone:</strong> {customer.phoneNumber}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>Date Range:</strong> {fromDate} to {toDate}</p>
        </div>

        {/* Split Section */}
        <div style={{ display: "flex", gap: "30px" }}>
          
          {/* Orders */}
          <div style={{ flex: 1 }}>
            <h3>Orders</h3>
            <table width="100%" border={1} cellPadding={6} style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>ID</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{new Date(o.date).toLocaleDateString()}</td>
                    <td>{o.id.slice(0, 8)}</td>
                    <td>{o.quantity}</td>
                    <td>₹{o.finalPrice.toLocaleString()}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3}><strong>Total</strong></td>
                  <td><strong>₹{totalOrders.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payments */}
          <div style={{ flex: 1 }}>
            <h3>Payments</h3>
            <table width="100%" border={1} cellPadding={6} style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mode</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.date).toLocaleDateString()}</td>
                    <td>{p.modeOfPayment}</td>
                    <td>₹{p.amount.toLocaleString()}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2}><strong>Total</strong></td>
                  <td><strong>₹{totalPayments.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Outstanding */}
        <div style={{ marginTop: "40px", textAlign: "right" }}>
          <h2>
            Outstanding Amount: ₹{outstanding.toLocaleString()}
          </h2>
        </div>

        <p style={{ marginTop: "30px", fontSize: "12px", textAlign: "center" }}>
          Generated on {new Date().toLocaleString()}
        </p>
      </div>
    );
  }
);
