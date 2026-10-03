import { createClient } from '@/utils/supabase/server'
import { ArrowLeft, Printer } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function BillPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()

  // Wait for the route params to resolve in Next.js 15+ (if using newer Next.js version)
  const { id } = await params

  if (!id) return notFound()

  const { data: transaction, error } = await supabase
    .from('gold_transactions')
    .select('*, customers(*), payments(*)')
    .eq('id', id)
    .single()

  if (error || !transaction) {
    return notFound()
  }

  const customer = transaction.customers

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 p-8 print:p-0 print:bg-white">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex justify-between items-center print:hidden">
          <Link href="/" className="text-gray-500 hover:text-gray-900 inline-flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <button 
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
          >
            <Printer size={18} /> Print Bill
          </button>
        </header>

        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0">
          {/* Bill Header */}
          <div className="text-center mb-10 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900">MOHITH JEWELLERS</h1>
            <p className="text-gray-500 mt-2">123 Gold Market, Main Street, City</p>
            <p className="text-gray-500">GSTIN: 22AAAAA0000A1Z5 | Ph: +91 9876543210</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Billed To:</p>
              <h2 className="text-lg font-semibold text-gray-900">{customer?.name}</h2>
              {customer?.phone && <p className="text-gray-600">Ph: {customer.phone}</p>}
              {customer?.address && <p className="text-gray-600 mt-1 whitespace-pre-wrap">{customer.address}</p>}
            </div>
            <div className="text-right">
              <p className="text-gray-500 mb-1">Invoice Details:</p>
              <p className="font-semibold text-gray-900">No: INV-{transaction.id.split('-')[0].toUpperCase()}</p>
              <p className="text-gray-600">Date: {new Date(transaction.created_at).toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left border-collapse mb-10">
            <thead>
              <tr className="border-b-2 border-gray-900 text-sm font-semibold text-gray-900">
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Gross Wt.</th>
                <th className="pb-3 text-right">Wastage</th>
                <th className="pb-3 text-right">Net Wt.</th>
                <th className="pb-3 text-right">Rate/g</th>
                <th className="pb-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-200">
                <td className="py-4 font-medium text-gray-900">{transaction.item_name}</td>
                <td className="py-4 text-right text-gray-700">{transaction.weight_grams.toFixed(3)}g</td>
                <td className="py-4 text-right text-gray-700">{transaction.wastage_percentage}%</td>
                <td className="py-4 text-right text-gray-700">{transaction.net_weight.toFixed(3)}g</td>
                <td className="py-4 text-right text-gray-700">₹{transaction.gold_rate_per_gram.toLocaleString('en-IN')}</td>
                <td className="py-4 text-right font-medium text-gray-900">
                  ₹{(transaction.net_weight * transaction.gold_rate_per_gram).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Summary */}
          <div className="flex justify-end mb-12">
            <div className="w-1/2 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Value of Goods:</span>
                <span>₹{(transaction.net_weight * transaction.gold_rate_per_gram).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Making Charges:</span>
                <span>₹{transaction.making_charges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-900 border-t border-gray-100 pt-3">
                <span>Taxable Amount:</span>
                <span>₹{transaction.taxable_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>CGST (1.5%):</span>
                <span>₹{transaction.cgst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>SGST (1.5%):</span>
                <span>₹{transaction.sgst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t-2 border-gray-900 pt-3">
                <span>Grand Total:</span>
                <span>₹{transaction.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-6">
            <p>Thank you for shopping with Mohith Jewellers.</p>
            <p>Subject to City Jurisdiction. E.&O.E.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
