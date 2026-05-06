import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Printer, Receipt } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import Modal from "../components/ui/Modal";
import { cn } from "../lib/utils";

import { useDispatch, useSelector } from "react-redux";
import { fetchCustomersWOP } from "../redux/slices/customerSlice";
import { fetchProductsWOP } from "../redux/slices/productSlice";

export default function Billing() {
  const dispatch = useDispatch();
  const { customersWOP } = useSelector((state) => state.customer);
  const { productsWOP } = useSelector((state) => state.product);
  
  const [items, setItems] = useState([{ id: Date.now(), product: "", qty: 1, price: 0, total: 0 }]);
  const [applyGst, setApplyGst] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const componentRef = useRef();

  useEffect(() => {
    dispatch(fetchCustomersWOP(""));
    dispatch(fetchProductsWOP(""));
  }, []);

  const selectedCustomer = customersWOP.find(c => c._id === selectedCustomerId);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: "", qty: 1, price: 0, total: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'product') {
          const prod = productsWOP.find(p => p._id === value);
          updated.price = prod ? prod.price : 0;
          updated.productName = prod ? prod.name : "";
        }
        updated.total = updated.qty * updated.price;
        return updated;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const gstAmount = applyGst ? subtotal * 0.18 : 0;
  const grandTotal = Math.max(0, subtotal + gstAmount - discount);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tmain tracking-tight">Billing & Invoice</h1>
          <p className="text-sm text-tmuted mt-1">Create new POS invoices. GST and Stock updates automatically apply on Checkout.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-tmain mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-500 flex items-center justify-center border border-primary-500/30">1</span>
              Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-tmuted">Select Customer</label>
                <select 
                  className="w-full px-4 py-3 glass-input text-sm font-medium"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  <option value="">-- Select or Search Customer --</option>
                  {customersWOP.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.mobile})</option>
                  ))}
                </select>
              </div>
              <FormInput label="Billing Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              <FormInput label="Payment Method" type="text" placeholder="Cash / UPI / Bank" />
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-tmain flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center border border-indigo-500/30">2</span>
                Products
              </h3>
              <Button variant="ghost" onClick={addItem} className="text-primary-500 hover:text-primary-600 h-9 px-3 border border-primary-500/20 bg-primary-500/5 hover:bg-primary-500/10 dark:text-primary-400 dark:hover:text-primary-300">
                <Plus size={16} /> Add Row
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-tmuted uppercase tracking-widest px-2">
                <div className="col-span-5">Product</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-2">Price (₹)</div>
                <div className="col-span-2">Total (₹)</div>
                <div className="col-span-1"></div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end md:items-center bg-surface/50 p-4 md:p-2 rounded-2xl border border-surfaceBorder md:border-transparent md:bg-transparent transition-all">
                  <div className="md:col-span-5 space-y-2 md:space-y-0">
                    <label className="md:hidden text-xs font-semibold text-tmuted">Product</label>
                    <select 
                      className="w-full px-4 py-2.5 glass-input text-sm font-medium"
                      value={item.product}
                      onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                    >
                      <option value="">Select...</option>
                      {productsWOP.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 col-span-1 md:col-span-6 gap-4 w-full">
                    <div className="col-span-1 md:col-span-2 space-y-2 md:space-y-0">
                      <label className="md:hidden text-xs font-semibold text-tmuted">Qty</label>
                      <input 
                        type="number" min="1" 
                        className="w-full px-4 py-2.5 glass-input text-sm font-medium text-center"
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2 md:space-y-0">
                      <label className="md:hidden text-xs font-semibold text-tmuted">Price</label>
                      <input 
                        type="number" readOnly
                        className="w-full px-4 py-2.5 bg-surface border border-surfaceBorder/50 rounded-xl text-sm font-medium text-tmuted cursor-not-allowed outline-none"
                        value={item.price}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2 md:space-y-0">
                      <label className="md:hidden text-xs font-semibold text-tmuted">Total</label>
                      <input 
                        type="number" readOnly
                        className="w-full px-4 py-2.5 bg-surface border border-surfaceBorder/50 rounded-xl text-sm font-bold text-tmain cursor-not-allowed outline-none focus:ring-0 relative"
                        value={item.total}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-1 flex justify-end md:justify-center mt-3 md:mt-0">
                    <button onClick={() => removeItem(item.id)} className="p-2.5 text-tmuted hover:text-red-500 bg-surface hover:bg-surface/80 rounded-xl transition-all border border-surfaceBorder hover:border-red-500/30">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-b from-primary-900/40 to-surface border-primary-500/20 p-8 shadow-2xl relative overflow-hidden dark:from-primary-900/40 dark:to-slate-900/60">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] rounded-full pointer-events-none" />
            
            <h3 className="text-xl font-bold text-tmain mb-6 pb-4 border-b border-surfaceBorder/50 flex items-center gap-3 relative z-10">
              <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30">3</span>
              Summary
            </h3>

             <div className="mb-6 relative z-10 space-y-3">
               <div className="flex items-center gap-3 bg-surface/50 p-3 rounded-xl border border-surfaceBorder">
                 <input 
                   type="checkbox" 
                   id="gst-toggle" 
                   className="w-5 h-5 rounded border-surfaceBorder bg-surface text-primary-500 focus:ring-primary-500"
                   checked={applyGst}
                   onChange={(e) => setApplyGst(e.target.checked)}
                 />
                 <label htmlFor="gst-toggle" className="text-sm font-bold text-tmain cursor-pointer select-none">
                   Apply 18% GST Header
                 </label>
               </div>

               <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-white/50 uppercase tracking-widest pl-1">Discount Amount (₹)</label>
                 <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 font-bold">₹</div>
                   <input 
                     type="number" 
                     value={discount || ""}
                     onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                     className="w-full pl-8 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm font-bold text-white focus:border-primary-500 outline-none transition-all shadow-inner placeholder:text-white/20"
                     placeholder="0.00"
                   />
                 </div>
               </div>
             </div>

            <div className="space-y-4 text-sm font-medium relative z-10">
              <div className="flex justify-between text-tmuted">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              {applyGst && (
                <>
                  <div className="flex justify-between text-tmuted text-xs">
                    <span>CGST (9%)</span>
                    <span>₹{(gstAmount / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-tmuted text-xs">
                    <span>SGST (9%)</span>
                    <span>₹{(gstAmount / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-500 font-bold border-b border-surfaceBorder/50 pb-2">
                    <span>Total Tax</span>
                    <span>+ ₹{gstAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between text-tmuted">
                <span>Discount</span>
                <span className="text-primary-500 font-bold">-₹{discount.toFixed(2)}</span>
              </div>
              <div className="pt-6 mt-4 border-t border-surfaceBorder/50 flex justify-between items-center">
                <span className="text-lg font-bold text-tmain">Grand Total</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-400">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 space-y-4 relative z-10 border-t border-surfaceBorder/50">
              <Button className="w-full text-base py-3" onClick={() => setShowInvoice(true)}>
                <Receipt size={20} /> Preview & Generate Invoice
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={showInvoice} onClose={() => setShowInvoice(false)} title="Invoice Generator" className="max-w-4xl bg-slate-100">
        <div ref={componentRef} className="p-10 bg-white shadow-xl rounded-2xl mx-auto text-slate-900 print:shadow-none print:m-0 print:p-10" id="printable-invoice">
          <div className="flex justify-between items-start mb-12 pb-10 border-b-2 border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Agro</h2>
              </div>
              <p className="text-sm text-slate-500 font-medium">123 Agriculture Market, Phase 1</p>
              <p className="text-sm text-slate-500 font-medium">New Delhi, 110001, India</p>
              <p className="text-sm text-slate-500 font-medium">GST: 07AABCU9603R1ZX</p>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-black text-slate-200 mb-4 uppercase tracking-widest">Invoice</h1>
              <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 inline-block text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice No</p>
                <p className="text-lg font-bold text-slate-800">INV-2026-001</p>
                <div className="w-full h-px bg-slate-200 my-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                <p className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">Bill To</p>
            <h3 className="text-xl font-bold text-slate-900">{selectedCustomer?.name || "Cash Customer"}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{selectedCustomer?.village || selectedCustomer?.address || "N/A"}</p>
            <p className="text-sm text-slate-500 font-medium">{selectedCustomer?.mobile || ""}</p>
          </div>

          <table className="w-full text-left mb-10">
            <thead>
              <tr className="border-b-2 border-slate-800">
                <th className="py-4 px-4 text-xs font-bold text-slate-900 uppercase">Item Description</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-900 uppercase text-center">Qty</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-900 uppercase text-right">Rate</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-900 uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(item => item.product ? (
                <tr key={item.id}>
                  <td className="py-4 px-4 text-sm text-slate-800 font-bold">{item.productName}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 font-medium text-center bg-slate-50">{item.qty}</td>
                  <td className="py-4 px-4 text-sm text-slate-600 font-medium text-right">₹{item.price.toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm text-slate-900 font-bold text-right bg-slate-50">₹{item.total.toFixed(2)}</td>
                </tr>
              ) : null)}
            </tbody>
          </table>

          <div className="flex justify-end pt-4">
            <div className="w-80 space-y-4">
              <div className="flex justify-between text-sm text-slate-500 font-medium px-4">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {applyGst && (
                <>
                   <div className="flex justify-between text-sm text-slate-500 font-medium px-4">
                     <span>CGST (9%)</span>
                     <span>₹{(gstAmount / 2).toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-sm text-slate-500 font-medium px-4">
                     <span>SGST (9%)</span>
                     <span>₹{(gstAmount / 2).toFixed(2)}</span>
                   </div>
                </>
              )}
               <div className="flex justify-between text-sm text-slate-400 font-medium px-4">
                 <span>Discount Applied</span>
                 <span className="text-emerald-600 font-bold">- ₹{discount.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-xl font-black text-emerald-600 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                 <span>Total</span>
                 <span>₹{grandTotal.toFixed(2)}</span>
               </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t-2 border-slate-100 text-center text-sm font-medium text-slate-400">
            This is a computer generated invoice and does not require a signature.
            <br />Thank you for doing business with Agro.
          </div>
        </div>

        <div className="pt-6 flex items-center justify-end gap-4 mt-8 border-t border-slate-200 print:hidden px-6 pb-6">
          <Button variant="ghost" className="text-slate-500 hover:text-slate-800 hover:bg-slate-200" onClick={() => setShowInvoice(false)}>Close</Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl text-base px-6 font-bold" onClick={handlePrint}>
            <Printer size={18} /> Print Invoice
          </Button>
        </div>
      </Modal>
    </div>
  );
}
