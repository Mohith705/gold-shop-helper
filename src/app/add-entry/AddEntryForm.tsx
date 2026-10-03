'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addCustomerAndTransaction } from '../actions'
import { Calculator, Loader2 } from 'lucide-react'

export function AddEntryForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [weight, setWeight] = useState<number>(0)
  const [wastage, setWastage] = useState<number>(0)
  const [rate, setRate] = useState<number>(0)
  const [makingCharges, setMakingCharges] = useState<number>(0)

  // Calculations
  const netWeight = weight + (weight * (wastage / 100))
  const taxableAmount = (netWeight * rate) + makingCharges
  const cgst = taxableAmount * 0.015
  const sgst = taxableAmount * 0.015
  const totalAmount = taxableAmount + cgst + sgst

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await addCustomerAndTransaction(formData)
      if (res?.error) {
        alert(res.error)
      } else if (res?.success) {
        router.push(`/bill/${res.transactionId}?mode=admin`)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Customer Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Customer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input required name="name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input name="phone" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"></textarea>
          </div>
        </div>
      </section>

      {/* Transaction Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Item Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name / Description</label>
            <input required name="item_name" type="text" placeholder="e.g. 22K Gold Chain" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
            <input name="hsn_code" type="text" defaultValue="7113" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Weight (grams)</label>
            <input required name="weight_grams" type="number" step="0.001" value={weight || ''} onChange={e => setWeight(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wastage (%)</label>
            <input required name="wastage_percentage" type="number" step="0.01" value={wastage || ''} onChange={e => setWastage(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gold Rate (per gram)</label>
            <input required name="gold_rate_per_gram" type="number" step="0.01" value={rate || ''} onChange={e => setRate(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Making Charges (₹)</label>
            <input name="making_charges" type="number" step="0.01" value={makingCharges || ''} onChange={e => setMakingCharges(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
        </div>
      </section>

      {/* Calculator Summary */}
      <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <div className="flex items-center gap-2 text-indigo-900 font-semibold mb-4">
          <Calculator size={20} />
          <h3>Live Estimate</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-indigo-600/70 mb-1">Net Weight</p>
            <p className="font-semibold text-indigo-900">{netWeight.toFixed(3)} g</p>
          </div>
          <div>
            <p className="text-indigo-600/70 mb-1">Taxable Value</p>
            <p className="font-semibold text-indigo-900">₹{taxableAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-indigo-600/70 mb-1">CGST (1.5%) + SGST (1.5%)</p>
            <p className="font-semibold text-indigo-900">₹{(cgst + sgst).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-indigo-600/70 mb-1">Grand Total</p>
            <p className="font-bold text-xl text-indigo-900">₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900">Payment Entry</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
            <input name="amount_paid" type="number" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select name="payment_method" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white">
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
      </section>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {isPending ? <Loader2 className="animate-spin" size={20} /> : null}
        {isPending ? 'Processing...' : 'Save & Generate Bill'}
      </button>
    </form>
  )
}
