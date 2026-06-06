import { useState, useEffect } from "react";

// ─── PERSISTENT STORAGE HELPERS ───────────────────────────────────────────────
function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    crm: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    invoice: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    docs: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
    tasks: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 0 2-2h11",
    plus: "M12 5v14 M5 12h14",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    trash: "M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2",
    close: "M18 6L6 18 M6 6l12 12",
    rand: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 8v4l3 3",
    download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    check: "M20 6L9 17l-5-5",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.18 2.72h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.07a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    zar: "M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  };
  const d = icons[name] || icons.dashboard;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((seg, i) => <path key={i} d={(i === 0 ? "" : "M") + seg} />)}
    </svg>
  );
};

// ─── INITIAL SEED DATA ─────────────────────────────────────────────────────────
const SEED = {
  customers: [
    { id: "c1", name: "Naledi Dlamini", email: "naledi@fashionbynd.co.za", phone: "072 445 6789", company: "Fashion by ND", status: "Active", notes: "Repeat client, loves fast turnaround", value: 4500, created: "2026-03-12" },
    { id: "c2", name: "Thabo Mokoena", email: "thabo@jozicatering.co.za", phone: "083 211 3344", company: "Jozi Catering Co", status: "Lead", notes: "Met at NSBC event, interested in contract templates", value: 0, created: "2026-05-01" },
    { id: "c3", name: "Priya Naidoo", email: "priya@pixelwave.co.za", phone: "061 987 0023", company: "PixelWave Design", status: "Active", notes: "Web design client, quarterly retainer", value: 12000, created: "2026-01-08" },
  ],
  invoices: [
    { id: "inv001", customer: "Naledi Dlamini", items: [{ desc: "Brand identity pack", qty: 1, rate: 4500 }], status: "Paid", date: "2026-03-15", due: "2026-03-30", notes: "" },
    { id: "inv002", customer: "Priya Naidoo", items: [{ desc: "Monthly retainer - April", qty: 1, rate: 4000 }, { desc: "Extra revisions", qty: 2, rate: 500 }], status: "Unpaid", date: "2026-05-01", due: "2026-05-15", notes: "Please pay via EFT" },
    { id: "inv003", customer: "Thabo Mokoena", items: [{ desc: "Catering contract template", qty: 1, rate: 350 }], status: "Draft", date: "2026-06-01", due: "2026-06-14", notes: "" },
  ],
  documents: [
    { id: "d1", name: "Service Agreement", category: "Legal", desc: "Standard service agreement for freelance work", downloads: 14 },
    { id: "d2", name: "Invoice Template (VAT)", category: "Finance", desc: "VAT-compliant invoice template for SA businesses", downloads: 31 },
    { id: "d3", name: "Employment Contract", category: "HR", desc: "BCEA-aligned employment contract template", downloads: 8 },
    { id: "d4", name: "Business Proposal", category: "Sales", desc: "Professional proposal template with cover page", downloads: 22 },
    { id: "d5", name: "NDA Template", category: "Legal", desc: "Non-disclosure agreement for client projects", downloads: 17 },
  ],
  tasks: [
    { id: "t1", title: "Follow up with Thabo re: catering contract", priority: "High", status: "Todo", due: "2026-06-08", related: "Thabo Mokoena" },
    { id: "t2", title: "Send INV002 reminder to Priya", priority: "High", status: "Todo", due: "2026-06-07", related: "Priya Naidoo" },
    { id: "t3", title: "Update document library with new HR forms", priority: "Medium", status: "In Progress", due: "2026-06-15", related: "" },
    { id: "t4", title: "Register dokkit.co.za domain", priority: "Medium", status: "Done", due: "2026-06-05", related: "" },
    { id: "t5", title: "Set up Mailchimp for waitlist", priority: "Low", status: "Todo", due: "2026-06-20", related: "" },
  ],
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,6,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "20px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflow: "auto", padding: "32px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "var(--surface)", border: "none", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}><Icon name="close" size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── FIELD ────────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 14px", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "0.92rem", outline: "none", boxSizing: "border-box" };
const selectStyle = { ...inputStyle, cursor: "pointer" };

// ─── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    Active: { bg: "#1a3a25", color: "#4ade80" },
    Lead: { bg: "#1a2a3a", color: "#60a5fa" },
    Inactive: { bg: "#2a1a1a", color: "#f87171" },
    Paid: { bg: "#1a3a25", color: "#4ade80" },
    Unpaid: { bg: "#3a2a10", color: "#fbbf24" },
    Draft: { bg: "#2a2a3a", color: "#a78bfa" },
    Overdue: { bg: "#3a1a1a", color: "#f87171" },
    High: { bg: "#3a1a1a", color: "#f87171" },
    Medium: { bg: "#3a2a10", color: "#fbbf24" },
    Low: { bg: "#1a3a25", color: "#4ade80" },
    Todo: { bg: "#2a2a3a", color: "#a78bfa" },
    "In Progress": { bg: "#1a2a3a", color: "#60a5fa" },
    Done: { bg: "#1a3a25", color: "#4ade80" },
    Legal: { bg: "#2a1a3a", color: "#c084fc" },
    Finance: { bg: "#3a2a10", color: "#fbbf24" },
    HR: { bg: "#1a2a3a", color: "#60a5fa" },
    Sales: { bg: "#1a3a25", color: "#4ade80" },
    Operations: { bg: "#2a2a3a", color: "#a78bfa" },
  };
  const s = map[status] || { bg: "#2a2a2a", color: "#aaa" };
  return <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em", padding: "3px 10px", borderRadius: "100px", textTransform: "uppercase" }}>{status}</span>;
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px 24px" }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: accent || "var(--text)", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "6px" }}>{sub}</div>}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ customers, invoices, tasks }) {
  const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.items.reduce((a, x) => a + x.qty * x.rate, 0), 0);
  const outstanding = invoices.filter(i => i.status === "Unpaid").reduce((s, i) => s + i.items.reduce((a, x) => a + x.qty * x.rate, 0), 0);
  const openTasks = tasks.filter(t => t.status !== "Done").length;
  const activeClients = customers.filter(c => c.status === "Active").length;

  const recentActivity = [
    ...invoices.slice(-3).map(i => ({ type: "invoice", text: `Invoice ${i.id} — ${i.customer}`, status: i.status, date: i.date })),
    ...tasks.filter(t => t.status !== "Done").slice(0, 2).map(t => ({ type: "task", text: t.title, status: t.priority, date: t.due })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Good day 👋</h1>
        <p style={{ color: "var(--muted)", marginTop: "4px" }}>Here's what's happening with DokKit today.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "14px", marginBottom: "28px" }}>
        <StatCard label="Revenue (Paid)" value={`R${totalRevenue.toLocaleString()}`} sub="Total collected" accent="var(--accent)" />
        <StatCard label="Outstanding" value={`R${outstanding.toLocaleString()}`} sub="Awaiting payment" accent="#fbbf24" />
        <StatCard label="Active Clients" value={activeClients} sub={`${customers.filter(c=>c.status==="Lead").length} leads in pipeline`} />
        <StatCard label="Open Tasks" value={openTasks} sub={`${tasks.filter(t=>t.priority==="High"&&t.status!=="Done").length} high priority`} accent="#f87171" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px 24px" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>Recent Activity</div>
          {recentActivity.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: "0.88rem", color: "var(--text)", flex: 1, marginRight: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.text}</div>
              <Badge status={a.status} />
            </div>
          ))}
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px 24px" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>Urgent Tasks</div>
          {tasks.filter(t => t.priority === "High" && t.status !== "Done").slice(0, 4).map((t, i, arr) => (
            <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171", marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.88rem", color: "var(--text)" }}>{t.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>Due {t.due}</div>
              </div>
            </div>
          ))}
          {tasks.filter(t => t.priority === "High" && t.status !== "Done").length === 0 && <div style={{ color: "var(--muted)", fontSize: "0.88rem" }}>No urgent tasks 🎉</div>}
        </div>
      </div>
    </div>
  );
}

// ─── CRM ─────────────────────────────────────────────────────────────────────
function CRM({ customers, setCustomers }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");

  const blank = { name: "", email: "", phone: "", company: "", status: "Lead", notes: "", value: 0, created: new Date().toISOString().slice(0, 10) };

  const openNew = () => { setForm({ ...blank }); setModal("new"); };
  const openEdit = (c) => { setForm({ ...c }); setModal("edit"); };

  const saveCustomer = () => {
    if (!form.name) return;
    let updated;
    if (modal === "new") {
      updated = [...customers, { ...form, id: "c" + Date.now(), value: Number(form.value) || 0 }];
    } else {
      updated = customers.map(c => c.id === form.id ? { ...form, value: Number(form.value) || 0 } : c);
    }
    setCustomers(updated);
    save("customers", updated);
    setModal(null);
  };

  const deleteCustomer = (id) => {
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    save("customers", updated);
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Customers & Leads</h1>
          <p style={{ color: "var(--muted)", marginTop: "2px", fontSize: "0.88rem" }}>{customers.filter(c => c.status === "Active").length} active · {customers.filter(c => c.status === "Lead").length} leads</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ ...inputStyle, width: "180px" }} />
          <button onClick={openNew} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-body)" }}>
            <Icon name="plus" size={16} /> Add
          </button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map(c => (
          <div key={c.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--accent)", flexShrink: 0 }}>
              {c.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: "140px" }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{c.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{c.company}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--muted)" }}>
              <Icon name="mail" size={13} />{c.email}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--muted)" }}>
              <Icon name="phone" size={13} />{c.phone}
            </div>
            {c.value > 0 && <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent)", fontSize: "0.95rem" }}>R{Number(c.value).toLocaleString()}</div>}
            <Badge status={c.status} />
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => openEdit(c)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}><Icon name="edit" size={14} /></button>
              <button onClick={() => deleteCustomer(c.id)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171" }}><Icon name="trash" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {(modal === "new" || modal === "edit") && (
        <Modal title={modal === "new" ? "New Customer / Lead" : "Edit Customer"} onClose={() => setModal(null)}>
          <Field label="Full Name"><input style={inputStyle} value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Naledi Dlamini" /></Field>
          <Field label="Company"><input style={inputStyle} value={form.company || ""} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Business name" /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Email"><input style={inputStyle} value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Phone"><input style={inputStyle} value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Status">
              <select style={selectStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Lead</option><option>Active</option><option>Inactive</option>
              </select>
            </Field>
            <Field label="Lifetime Value (R)"><input style={inputStyle} type="number" value={form.value || ""} onChange={e => setForm({ ...form, value: e.target.value })} /></Field>
          </div>
          <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
          <button onClick={saveCustomer} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>Save Customer</button>
        </Modal>
      )}
    </div>
  );
}

// ─── INVOICES ─────────────────────────────────────────────────────────────────
function Invoices({ invoices, setInvoices, customers }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const blank = { customer: "", items: [{ desc: "", qty: 1, rate: 0 }], status: "Draft", date: new Date().toISOString().slice(0, 10), due: "", notes: "" };

  const openNew = () => { setForm({ ...blank, id: "INV" + String(Date.now()).slice(-5) }); setModal("new"); };
  const openEdit = inv => { setForm({ ...inv, items: inv.items.map(i => ({ ...i })) }); setModal("edit"); };

  const total = (items) => items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);

  const saveInvoice = () => {
    if (!form.customer) return;
    let updated;
    if (modal === "new") updated = [...invoices, { ...form }];
    else updated = invoices.map(i => i.id === form.id ? { ...form } : i);
    setInvoices(updated);
    save("invoices", updated);
    setModal(null);
  };

  const deleteInvoice = id => {
    const updated = invoices.filter(i => i.id !== id);
    setInvoices(updated);
    save("invoices", updated);
  };

  const updateStatus = (id, status) => {
    const updated = invoices.map(i => i.id === id ? { ...i, status } : i);
    setInvoices(updated);
    save("invoices", updated);
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { desc: "", qty: 1, rate: 0 }] });
  const removeItem = idx => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  const updateItem = (idx, field, val) => setForm({ ...form, items: form.items.map((it, i) => i === idx ? { ...it, [field]: val } : it) });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Invoices</h1>
          <p style={{ color: "var(--muted)", marginTop: "2px", fontSize: "0.88rem" }}>
            R{invoices.filter(i => i.status === "Unpaid").reduce((s, i) => s + total(i.items), 0).toLocaleString()} outstanding
          </p>
        </div>
        <button onClick={openNew} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-body)" }}>
          <Icon name="plus" size={16} /> New Invoice
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {invoices.map(inv => (
          <div key={inv.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem", color: "var(--muted)", minWidth: "80px" }}>{inv.id}</div>
              <div style={{ flex: 1, fontWeight: 700 }}>{inv.customer}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Due {inv.due || "—"}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--accent)" }}>R{total(inv.items).toLocaleString()}</div>
              <Badge status={inv.status} />
              <select value={inv.status} onChange={e => updateStatus(inv.id, e.target.value)} style={{ ...selectStyle, width: "auto", padding: "6px 10px", fontSize: "0.8rem" }}>
                <option>Draft</option><option>Unpaid</option><option>Paid</option><option>Overdue</option>
              </select>
              <button onClick={() => openEdit(inv)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}><Icon name="edit" size={14} /></button>
              <button onClick={() => deleteInvoice(inv.id)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171" }}><Icon name="trash" size={14} /></button>
            </div>
            <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {inv.items.map((it, i) => (
                <span key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "4px 10px", fontSize: "0.8rem", color: "var(--muted)" }}>
                  {it.desc} × {it.qty} @ R{Number(it.rate).toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {(modal === "new" || modal === "edit") && (
        <Modal title={modal === "new" ? "New Invoice" : `Edit ${form.id}`} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Invoice #"><input style={inputStyle} value={form.id || ""} onChange={e => setForm({ ...form, id: e.target.value })} /></Field>
            <Field label="Status">
              <select style={selectStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Draft</option><option>Unpaid</option><option>Paid</option><option>Overdue</option>
              </select>
            </Field>
          </div>
          <Field label="Customer">
            <select style={selectStyle} value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })}>
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Invoice Date"><input style={inputStyle} type="date" value={form.date || ""} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Due Date"><input style={inputStyle} type="date" value={form.due || ""} onChange={e => setForm({ ...form, due: e.target.value })} /></Field>
          </div>
          <Field label="Line Items">
            {(form.items || []).map((it, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 32px", gap: "6px", marginBottom: "6px" }}>
                <input style={inputStyle} placeholder="Description" value={it.desc} onChange={e => updateItem(idx, "desc", e.target.value)} />
                <input style={inputStyle} type="number" placeholder="Qty" value={it.qty} onChange={e => updateItem(idx, "qty", e.target.value)} />
                <input style={inputStyle} type="number" placeholder="Rate" value={it.rate} onChange={e => updateItem(idx, "rate", e.target.value)} />
                <button onClick={() => removeItem(idx)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", color: "#f87171", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="close" size={12} /></button>
              </div>
            ))}
            <button onClick={addItem} style={{ background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: "8px", padding: "8px", width: "100%", cursor: "pointer", color: "var(--muted)", fontSize: "0.82rem", fontFamily: "var(--font-body)", marginTop: "4px" }}>+ Add line item</button>
            <div style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--accent)", marginTop: "8px" }}>Total: R{total(form.items || []).toLocaleString()}</div>
          </Field>
          <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
          <button onClick={saveInvoice} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>Save Invoice</button>
        </Modal>
      )}
    </div>
  );
}

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
function Documents({ documents, setDocuments }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [filter, setFilter] = useState("All");

  const cats = ["All", "Legal", "Finance", "HR", "Sales", "Operations"];
  const blank = { name: "", category: "Legal", desc: "", downloads: 0 };

  const saveDoc = () => {
    if (!form.name) return;
    let updated;
    if (!form.id) updated = [...documents, { ...form, id: "d" + Date.now(), downloads: 0 }];
    else updated = documents.map(d => d.id === form.id ? { ...form } : d);
    setDocuments(updated);
    save("documents", updated);
    setModal(false);
  };

  const deleteDoc = id => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    save("documents", updated);
  };

  const download = id => {
    const updated = documents.map(d => d.id === id ? { ...d, downloads: d.downloads + 1 } : d);
    setDocuments(updated);
    save("documents", updated);
  };

  const filtered = filter === "All" ? documents : documents.filter(d => d.category === filter);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Document Library</h1>
          <p style={{ color: "var(--muted)", marginTop: "2px", fontSize: "0.88rem" }}>{documents.length} templates available</p>
        </div>
        <button onClick={() => { setForm({ ...blank }); setModal(true); }} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-body)" }}>
          <Icon name="plus" size={16} /> Add Doc
        </button>
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? "var(--accent)" : "var(--surface)", color: filter === c ? "#fff" : "var(--muted)", border: "1px solid var(--border)", borderRadius: "100px", padding: "6px 14px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "14px" }}>
        {filtered.map(d => (
          <div key={d.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ width: 40, height: 40, background: "var(--accent-dim)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}><Icon name="docs" size={20} /></div>
              <Badge status={d.category} />
            </div>
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>{d.name}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "14px", lineHeight: 1.5 }}>{d.desc}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>↓ {d.downloads} downloads</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => { setForm({ ...d }); setModal(true); }} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}><Icon name="edit" size={13} /></button>
                <button onClick={() => deleteDoc(d.id)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171" }}><Icon name="trash" size={13} /></button>
                <button onClick={() => download(d.id)} style={{ background: "var(--accent)", border: "none", borderRadius: "8px", padding: "0 10px", height: 30, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: "#fff", fontSize: "0.78rem", fontWeight: 700, fontFamily: "var(--font-body)" }}><Icon name="download" size={12} />Get</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={form.id ? "Edit Document" : "Add Document"} onClose={() => setModal(false)}>
          <Field label="Document Name"><input style={inputStyle} value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Freelance Service Agreement" /></Field>
          <Field label="Category">
            <select style={selectStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option>Legal</option><option>Finance</option><option>HR</option><option>Sales</option><option>Operations</option>
            </select>
          </Field>
          <Field label="Description"><textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.desc || ""} onChange={e => setForm({ ...form, desc: e.target.value })} /></Field>
          <button onClick={saveDoc} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>Save Document</button>
        </Modal>
      )}
    </div>
  );
}

// ─── TASKS ────────────────────────────────────────────────────────────────────
function Tasks({ tasks, setTasks, customers }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [filter, setFilter] = useState("All");

  const blank = { title: "", priority: "Medium", status: "Todo", due: "", related: "" };

  const saveTask = () => {
    if (!form.title) return;
    let updated;
    if (!form.id) updated = [...tasks, { ...form, id: "t" + Date.now() }];
    else updated = tasks.map(t => t.id === form.id ? { ...form } : t);
    setTasks(updated);
    save("tasks", updated);
    setModal(false);
  };

  const deleteTask = id => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    save("tasks", updated);
  };

  const cycleStatus = id => {
    const cycle = { "Todo": "In Progress", "In Progress": "Done", "Done": "Todo" };
    const updated = tasks.map(t => t.id === id ? { ...t, status: cycle[t.status] } : t);
    setTasks(updated);
    save("tasks", updated);
  };

  const cols = ["Todo", "In Progress", "Done"];
  const filtered = filter === "All" ? tasks : tasks.filter(t => t.priority === filter);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Tasks</h1>
          <p style={{ color: "var(--muted)", marginTop: "2px", fontSize: "0.88rem" }}>{tasks.filter(t => t.status !== "Done").length} open · {tasks.filter(t => t.status === "Done").length} done</p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["All", "High", "Medium", "Low"].map(p => (
            <button key={p} onClick={() => setFilter(p)} style={{ background: filter === p ? "var(--accent)" : "var(--surface)", color: filter === p ? "#fff" : "var(--muted)", border: "1px solid var(--border)", borderRadius: "100px", padding: "6px 14px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>{p}</button>
          ))}
          <button onClick={() => { setForm({ ...blank }); setModal(true); }} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "10px", padding: "8px 16px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-body)" }}><Icon name="plus" size={15} />Add</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
        {cols.map(col => (
          <div key={col} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>{col}</div>
              <div style={{ background: "var(--card)", borderRadius: "100px", padding: "2px 9px", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)" }}>
                {filtered.filter(t => t.status === col).length}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filtered.filter(t => t.status === col).map(t => (
                <div key={t.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                    <button onClick={() => cycleStatus(t.id)} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${col === "Done" ? "#4ade80" : "var(--border)"}`, background: col === "Done" ? "#4ade80" : "transparent", cursor: "pointer", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {col === "Done" && <Icon name="check" size={10} />}
                    </button>
                    <div style={{ fontSize: "0.87rem", fontWeight: 600, flex: 1, lineHeight: 1.4, color: col === "Done" ? "var(--muted)" : "var(--text)", textDecoration: col === "Done" ? "line-through" : "none" }}>{t.title}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <Badge status={t.priority} />
                      {t.due && <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{t.due}</span>}
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button onClick={() => { setForm({ ...t }); setModal(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 0 }}><Icon name="edit" size={13} /></button>
                      <button onClick={() => deleteTask(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", padding: 0 }}><Icon name="trash" size={13} /></button>
                    </div>
                  </div>
                  {t.related && <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "6px" }}>🔗 {t.related}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={form.id ? "Edit Task" : "New Task"} onClose={() => setModal(false)}>
          <Field label="Task Title"><input style={inputStyle} value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Send proposal to client" /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <Field label="Priority">
              <select style={selectStyle} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </Field>
            <Field label="Status">
              <select style={selectStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Todo</option><option>In Progress</option><option>Done</option>
              </select>
            </Field>
            <Field label="Due Date"><input style={inputStyle} type="date" value={form.due || ""} onChange={e => setForm({ ...form, due: e.target.value })} /></Field>
          </div>
          <Field label="Related Customer (optional)">
            <select style={selectStyle} value={form.related || ""} onChange={e => setForm({ ...form, related: e.target.value })}>
              <option value="">None</option>
              {customers.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <button onClick={saveTask} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>Save Task</button>
        </Modal>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [customers, setCustomers] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setCustomers(load("customers") || SEED.customers);
    setInvoices(load("invoices") || SEED.invoices);
    setDocuments(load("documents") || SEED.documents);
    setTasks(load("tasks") || SEED.tasks);
    setLoaded(true);
  }, []);

  if (!loaded) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0E0B08", color: "#E8603C", fontFamily: "sans-serif", fontSize: "1.2rem" }}>
      Loading DokKit OS…
    </div>
  );

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "crm", label: "Customers", icon: "crm" },
    { id: "invoices", label: "Invoices", icon: "invoice" },
    { id: "documents", label: "Documents", icon: "docs" },
    { id: "tasks", label: "Tasks", icon: "tasks" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --bg: #0E0B08;
          --card: #161210;
          --surface: #1C1816;
          --border: rgba(255,255,255,0.07);
          --text: #F0EBE3;
          --muted: #7A6E64;
          --accent: #E8603C;
          --accent-dim: rgba(232,96,60,0.12);
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        input, select, textarea, button { font-family: var(--font-body); color: var(--text); }
        input:focus, select:focus, textarea:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(232,96,60,0.15); }
        @media(max-width:700px){ .sidebar{ display:none !important; } .topbar-nav{ display:flex !important; } }
      `}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* SIDEBAR */}
        <aside className="sidebar" style={{ width: 220, background: "var(--card)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
          <div style={{ padding: "0 20px 28px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.03em" }}>Dok<span style={{ color: "var(--accent)" }}>Kit</span></div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "2px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Business OS</div>
          </div>
          <nav style={{ flex: 1, padding: "16px 12px" }}>
            {nav.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", background: page === n.id ? "var(--accent-dim)" : "transparent", color: page === n.id ? "var(--accent)" : "var(--muted)", fontWeight: page === n.id ? 700 : 400, fontSize: "0.9rem", cursor: "pointer", marginBottom: "2px", textAlign: "left", transition: "all 0.15s", fontFamily: "var(--font-body)" }}>
                <Icon name={n.icon} size={17} />{n.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--muted)" }}>
            🇿🇦 Made for Mzansi
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px", background: "var(--bg)" }}>
          {/* Mobile top nav */}
          <div className="topbar-nav" style={{ display: "none", gap: "6px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
            {nav.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{ background: page === n.id ? "var(--accent)" : "var(--surface)", color: page === n.id ? "#fff" : "var(--muted)", border: "1px solid var(--border)", borderRadius: "100px", padding: "7px 14px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>
                {n.label}
              </button>
            ))}
          </div>

          {page === "dashboard" && <Dashboard customers={customers} invoices={invoices} tasks={tasks} />}
          {page === "crm" && <CRM customers={customers} setCustomers={setCustomers} />}
          {page === "invoices" && <Invoices invoices={invoices} setInvoices={setInvoices} customers={customers} />}
          {page === "documents" && <Documents documents={documents} setDocuments={setDocuments} />}
          {page === "tasks" && <Tasks tasks={tasks} setTasks={setTasks} customers={customers} />}
        </main>
      </div>
    </>
  );
}
