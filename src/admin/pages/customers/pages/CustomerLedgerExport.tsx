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
        {/* Header with logo */}
          <div style={{ position: 'relative', marginBottom: '5px', height: 48 }}>
            <h1 style={{ textAlign: 'center', margin: 0, fontSize: 32, fontWeight: 700, position: 'absolute', left: 0, right: 0, top: 0 }}>ARKA BRICKS</h1>
            <img src=""
                alt="Company Logo" 
                style={{ position: 'absolute', right: 0, top: 0, height: 48, width: 120, objectFit: 'contain' }} 
                onError={e => { e.currentTarget.style.display = 'none'; }} />
          </div>
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
            <h3 style={{ marginBottom: 8 }}>Orders</h3>
            <table width="100%" style={{ borderCollapse: "collapse", marginBottom: 16, fontSize: 15 }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ border: '1px solid #bbb', padding: 8 }}>Date</th>
                  <th style={{ border: '1px solid #bbb', padding: 8 }}>ID</th>
                  <th style={{ border: '1px solid #bbb', padding: 8, textAlign: 'right' }}>Qty</th>
                  <th style={{ border: '1px solid #bbb', padding: 8, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ border: '1px solid #bbb', padding: 8 }}>{new Date(o.date).toLocaleDateString()}</td>
                    <td style={{ border: '1px solid #bbb', padding: 8 }}>{o.id.slice(0, 8)}</td>
                    <td style={{ border: '1px solid #bbb', padding: 8, textAlign: 'right' }}>{o.quantity}</td>
                    <td style={{ border: '1px solid #bbb', padding: 8, textAlign: 'right' }}>₹{o.finalPrice.toLocaleString()}</td>
                  </tr>
                ))}
                <tr style={{ background: '#f5f5f5' }}>
                  <td colSpan={3} style={{ border: '1px solid #bbb', padding: 8, textAlign: 'right' }}><strong>Total</strong></td>
                  <td style={{ border: '1px solid #bbb', padding: 8, textAlign: 'right' }}><strong>₹{totalOrders.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Payments */}
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: 8 }}>Payments</h3>
            <table width="100%" style={{ borderCollapse: "collapse", marginBottom: 16, fontSize: 15 }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ border: '1px solid #bbb', padding: 8 }}>Date</th>
                  <th style={{ border: '1px solid #bbb', padding: 8 }}>Mode</th>
                  <th style={{ border: '1px solid #bbb', padding: 8, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ border: '1px solid #bbb', padding: 8 }}>{new Date(p.date).toLocaleDateString()}</td>
                    <td style={{ border: '1px solid #bbb', padding: 8 }}>{p.modeOfPayment}</td>
                    <td style={{ border: '1px solid #bbb', padding: 8, textAlign: 'right' }}>₹{p.amount.toLocaleString()}</td>
                  </tr>
                ))}
                <tr style={{ background: '#f5f5f5' }}>
                  <td colSpan={2} style={{ border: '1px solid #bbb', padding: 8, textAlign: 'right' }}><strong>Total</strong></td>
                  <td style={{ border: '1px solid #bbb', padding: 8, textAlign: 'right' }}><strong>₹{totalPayments.toLocaleString()}</strong></td>
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
