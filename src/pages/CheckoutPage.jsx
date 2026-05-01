import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .co-page { min-height: 100vh; background: #F8F7F4; font-family: 'DM Sans','Helvetica Neue',sans-serif; color: #111; }
  .co-hero { background: #1A1A2E; padding: 40px 32px 32px; }
  .co-hero-inner { max-width: 1100px; margin: 0 auto; }
  .co-breadcrumb { font-size: 13px; color: #7A7A9A; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .co-breadcrumb a { color: #C8963E; text-decoration: none; }
  .co-breadcrumb a:hover { text-decoration: underline; }
  .co-hero h1 { font-family: 'Playfair Display',Georgia,serif; font-size: 36px; font-weight: 700; color: #fff; letter-spacing: -0.5px; line-height: 1.2; }
  .co-steps { display: flex; align-items: center; margin-top: 28px; }
  .co-step { display: flex; align-items: center; gap: 10px; }
  .co-step-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; flex-shrink: 0; }
  .co-step-num.done { background: #C8963E; color: #fff; }
  .co-step-num.active { background: #fff; color: #1A1A2E; }
  .co-step-num.pending { background: #2A2A48; color: #5A5570; border: 1px solid #3A3A58; }
  .co-step-label { font-size: 13px; font-weight: 500; white-space: nowrap; }
  .co-step-label.active { color: #fff; }
  .co-step-label.done { color: #C8963E; }
  .co-step-label.pending { color: #5A5570; }
  .co-step-line { flex: 1; height: 1px; margin: 0 14px; min-width: 32px; }
  .co-step-line.done { background: #C8963E; }
  .co-step-line.pending { background: #3A3A58; }

  .co-body { max-width: 1100px; margin: 40px auto; padding: 0 32px; display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
  .co-card { background: #fff; border-radius: 16px; padding: 36px; border: 1px solid #E8E6E1; }
  .co-card-title { font-family: 'Playfair Display',Georgia,serif; font-size: 22px; font-weight: 600; color: #1A1A2E; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #F0ECE4; letter-spacing: -0.3px; }

  .co-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .co-full { grid-column: 1 / -1; }
  .co-label { display: block; font-size: 11px; font-weight: 600; color: #9A9590; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .co-input { width: 100%; padding: 13px 16px; border: 1.5px solid #E8E6E1; border-radius: 10px; font-size: 15px; font-family: 'DM Sans',sans-serif; color: #1A1A2E; background: #fff; outline: none; transition: border-color .2s, box-shadow .2s; }
  .co-input:focus { border-color: #C8963E; box-shadow: 0 0 0 3px rgba(200,150,62,.1); }
  .co-textarea { resize: vertical; min-height: 88px; }

  .co-options { display: flex; flex-direction: column; gap: 12px; }
  .co-opt { display: flex; align-items: center; gap: 16px; padding: 18px 20px; border: 1.5px solid #E8E6E1; border-radius: 12px; cursor: pointer; transition: all .2s; background: #fff; }
  .co-opt:hover { border-color: #C8963E; background: #FDFAF5; }
  .co-opt.sel { border-color: #1A1A2E; background: #F8F7F4; }
  .co-radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #D1CEC7; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color .2s; }
  .co-opt.sel .co-radio { border-color: #1A1A2E; }
  .co-radio-inner { width: 10px; height: 10px; border-radius: 50%; background: #1A1A2E; opacity: 0; transition: opacity .2s; }
  .co-opt.sel .co-radio-inner { opacity: 1; }
  .co-opt-body { flex: 1; }
  .co-opt-title { font-size: 15px; font-weight: 600; color: #1A1A2E; margin-bottom: 2px; }
  .co-opt-sub { font-size: 13px; color: #9A9590; }
  .co-opt-price { font-size: 15px; font-weight: 600; color: #1A1A2E; }

  .co-pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .co-actions { display: flex; gap: 12px; margin-top: 32px; padding-top: 28px; border-top: 1px solid #F0ECE4; }
  .co-back { padding: 13px 22px; border: 1.5px solid #E8E6E1; border-radius: 10px; background: #fff; color: #5A5550; font-size: 14px; font-weight: 600; font-family: 'DM Sans',sans-serif; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; transition: border-color .2s, color .2s; }
  .co-back:hover { border-color: #1A1A2E; color: #1A1A2E; }
  .co-next { flex: 1; padding: 14px; background: #1A1A2E; color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: 'DM Sans',sans-serif; cursor: pointer; transition: background .2s, transform .15s; }
  .co-next:hover { background: #C8963E; transform: translateY(-1px); }
  .co-pay-btn { flex: 1; padding: 15px; background: #C8963E; color: #fff; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; font-family: 'DM Sans',sans-serif; cursor: pointer; transition: all .2s; letter-spacing: .2px; }
  .co-pay-btn:hover { background: #A87830; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(200,150,62,.3); }

  .co-summary { background: #fff; border-radius: 16px; padding: 32px; border: 1px solid #E8E6E1; position: sticky; top: 88px; }
  .co-sum-title { font-family: 'Playfair Display',Georgia,serif; font-size: 18px; font-weight: 600; color: #1A1A2E; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #F0ECE4; }
  .co-item { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 18px; }
  .co-item-thumb { width: 56px; height: 56px; border-radius: 10px; background: linear-gradient(135deg,#E8E6E1,#D1CEC7); border: 1px solid #E8E6E1; flex-shrink: 0; }
  .co-item-name { font-size: 14px; font-weight: 500; color: #1A1A2E; line-height: 1.4; margin-bottom: 3px; }
  .co-item-qty { font-size: 12px; color: #9A9590; }
  .co-item-price { font-size: 14px; font-weight: 600; color: #1A1A2E; margin-left: auto; flex-shrink: 0; padding-left: 8px; }
  .co-divider { height: 1px; background: #F0ECE4; margin: 16px 0; }
  .co-row { display: flex; justify-content: space-between; font-size: 14px; color: #5A5550; margin-bottom: 9px; }
  .co-total { display: flex; justify-content: space-between; font-size: 17px; font-weight: 700; color: #1A1A2E; margin-top: 16px; padding-top: 16px; border-top: 2px solid #1A1A2E; }
  .co-notice { margin-top: 18px; padding: 14px 15px; background: #F4F3F0; border-radius: 10px; font-size: 12px; color: #9A9590; line-height: 1.6; }

  @media (max-width: 900px) {
    .co-body { grid-template-columns: 1fr; padding: 0 20px; margin: 24px auto; }
    .co-summary { position: static; }
    .co-hero { padding: 28px 20px 24px; }
    .co-hero h1 { font-size: 28px; }
    .co-card { padding: 24px; }
    .co-grid { grid-template-columns: 1fr; }
    .co-pay-grid { grid-template-columns: 1fr; }
    .co-steps { display: none; }
  }
`;

const cartItems = [
  { id: 1, name: "Royal Canin Adult Cat 2kg", price: 185000, qty: 2 },
  { id: 2, name: "Premium Dog Leash — Leather", price: 75000, qty: 1 },
];
const shippingOpts = [
  { id: "jne-reg", label: "JNE Regular", sub: "Estimated 3–5 business days", price: 15000 },
  { id: "jne-yes", label: "JNE YES — Next Day", sub: "Estimated 1 business day", price: 35000 },
  { id: "sicepat", label: "SiCepat BEST", sub: "Estimated 2–3 business days", price: 12000 },
];
const paymentOpts = [
  { id: "qris", label: "QRIS", sub: "Scan & pay instantly" },
  { id: "bca-va", label: "BCA Virtual Account", sub: "Transfer via BCA" },
  { id: "gopay", label: "GoPay", sub: "via Midtrans" },
  { id: "ovo", label: "OVO", sub: "via Midtrans" },
];

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", phone:"", address:"", city:"", province:"", postalCode:"", shipping:"jne-reg", payment:"qris" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const sub = cartItems.reduce((a, b) => a + b.price * b.qty, 0);
  const ship = shippingOpts.find(s => s.id === form.shipping);
  const total = sub + (ship?.price || 0);

  const stepLabels = ["Shipping Address","Delivery Method","Payment"];

  return (
    <>
      <style>{css}</style>
      <div className="co-page">
        <Navbar />
        <div className="co-hero">
          <div className="co-hero-inner">
            <div className="co-breadcrumb">
              <Link to="/">Home</Link><span>/</span>
              <Link to="/cart">Cart</Link><span>/</span>
              <span style={{color:"#fff"}}>Checkout</span>
            </div>
            <h1>Checkout</h1>
            <div className="co-steps">
              {stepLabels.map((s, i) => {
                const st = step > i+1 ? "done" : step===i+1 ? "active" : "pending";
                return (
                  <div key={i} className="co-step">
                    <div className={`co-step-num ${st}`}>{st==="done" ? <CheckIcon/> : i+1}</div>
                    <span className={`co-step-label ${st}`}>{s}</span>
                    {i < stepLabels.length-1 && <div className={`co-step-line ${step>i+1?"done":"pending"}`}/>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="co-body">
          <div>
            {step === 1 && (
              <div className="co-card">
                <h2 className="co-card-title">Shipping Address</h2>
                <div className="co-grid">
                  <div className="co-form-group"><label className="co-label">Full Name</label><input className="co-input" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="John Doe"/></div>
                  <div className="co-form-group"><label className="co-label">Phone Number</label><input className="co-input" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+62 8xx xxxx xxxx"/></div>
                  <div className="co-full"><label className="co-label">Street Address</label><textarea className="co-input co-textarea" value={form.address} onChange={e=>set("address",e.target.value)} placeholder="Street name, block, house number, RT/RW..."/></div>
                  <div><label className="co-label">City</label><input className="co-input" value={form.city} onChange={e=>set("city",e.target.value)} placeholder="Bandar Lampung"/></div>
                  <div><label className="co-label">Province</label><input className="co-input" value={form.province} onChange={e=>set("province",e.target.value)} placeholder="Lampung"/></div>
                  <div><label className="co-label">Postal Code</label><input className="co-input" value={form.postalCode} onChange={e=>set("postalCode",e.target.value)} placeholder="35111"/></div>
                </div>
                <div className="co-actions">
                  <Link to="/cart" className="co-back"><BackIcon/> Back to Cart</Link>
                  <button className="co-next" onClick={()=>setStep(2)}>Continue to Delivery</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="co-card">
                <h2 className="co-card-title">Delivery Method</h2>
                <div className="co-options">
                  {shippingOpts.map(opt=>(
                    <div key={opt.id} className={`co-opt${form.shipping===opt.id?" sel":""}`} onClick={()=>set("shipping",opt.id)}>
                      <div className="co-radio"><div className="co-radio-inner"/></div>
                      <div className="co-opt-body"><div className="co-opt-title">{opt.label}</div><div className="co-opt-sub">{opt.sub}</div></div>
                      <div className="co-opt-price">Rp {opt.price.toLocaleString("id-ID")}</div>
                    </div>
                  ))}
                </div>
                <div className="co-actions">
                  <button className="co-back" onClick={()=>setStep(1)}><BackIcon/> Back</button>
                  <button className="co-next" onClick={()=>setStep(3)}>Continue to Payment</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="co-card">
                <h2 className="co-card-title">Payment Method</h2>
                <p style={{fontSize:14,color:"#9A9590",marginBottom:24,lineHeight:1.6}}>Secured by Midtrans. All transactions are encrypted end-to-end.</p>
                <div className="co-pay-grid">
                  {paymentOpts.map(opt=>(
                    <div key={opt.id} className={`co-opt${form.payment===opt.id?" sel":""}`} onClick={()=>set("payment",opt.id)}>
                      <div className="co-radio"><div className="co-radio-inner"/></div>
                      <div className="co-opt-body"><div className="co-opt-title">{opt.label}</div><div className="co-opt-sub">{opt.sub}</div></div>
                    </div>
                  ))}
                </div>
                <div className="co-actions">
                  <button className="co-back" onClick={()=>setStep(2)}><BackIcon/> Back</button>
                  <button className="co-pay-btn" onClick={()=>alert("Connect to backend to process.")}>
                    Place Order — Rp {total.toLocaleString("id-ID")}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="co-summary">
            <h3 className="co-sum-title">Order Summary</h3>
            {cartItems.map(item=>(
              <div key={item.id} className="co-item">
                <div className="co-item-thumb"/>
                <div style={{flex:1}}>
                  <div className="co-item-name">{item.name}</div>
                  <div className="co-item-qty">Qty: {item.qty}</div>
                </div>
                <div className="co-item-price">Rp {(item.price*item.qty).toLocaleString("id-ID")}</div>
              </div>
            ))}
            <div className="co-divider"/>
            <div className="co-row"><span>Subtotal</span><span>Rp {sub.toLocaleString("id-ID")}</span></div>
            <div className="co-row"><span>Delivery</span><span>{ship ? `Rp ${ship.price.toLocaleString("id-ID")}` : "—"}</span></div>
            <div className="co-total"><span>Total</span><span>Rp {total.toLocaleString("id-ID")}</span></div>
            <div className="co-notice">By placing your order you agree to our Terms of Service. Payments are secured by Midtrans SSL encryption.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;