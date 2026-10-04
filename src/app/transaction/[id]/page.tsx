import { createClient } from '@/utils/supabase/server'
import { ArrowLeft, ReceiptText, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PaymentForm } from './PaymentForm'
import { DeleteButton } from './DeleteButton'
import { Pencil, FileSpreadsheet } from 'lucide-react'

export default async function TransactionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
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
  const payments = transaction.payments || []
  
  const totalPaid = payments.reduce((sum: number, p: any) => sum + Number(p.amount_paid), 0)
  const balanceDue = transaction.total_amount - totalPaid

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <Link href="/" className="text-gray-500 hover:text-gray-900 inline-flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href={`/transaction/${transaction.id}/edit`}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
            >
              <Pencil size={18} /> Edit
            </Link>
            <DeleteButton transactionId={transaction.id} />
            <Link 
              href={`/statement/${transaction.id}`}
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
            >
              <FileSpreadsheet size={18} /> Statement
            </Link>
            <Link 
              href={`/bill/${transaction.id}?mode=admin`}
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm"
            >
              <ReceiptText size={18} /> View Bill
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Customer Info</h2>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500 w-24 inline-block">Name:</span> <span className="font-medium text-gray-900">{customer?.name}</span></p>
                <p><span className="text-gray-500 w-24 inline-block">Phone:</span> <span className="text-gray-900">{customer?.phone || 'N/A'}</span></p>
                <p><span className="text-gray-500 w-24 inline-block">Address:</span> <span className="text-gray-900">{customer?.address || 'N/A'}</span></p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Item Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500 block">Item Name</span> <span className="font-medium text-gray-900">{transaction.item_name}</span></div>
                <div><span className="text-gray-500 block">Gross Wt.</span> <span className="text-gray-900">{transaction.weight_grams}g</span></div>
                <div><span className="text-gray-500 block">Wastage</span> <span className="text-gray-900">{transaction.wastage_percentage}%</span></div>
                <div><span className="text-gray-500 block">Net Wt.</span> <span className="font-medium text-indigo-600">{transaction.net_weight.toFixed(3)}g</span></div>
                <div><span className="text-gray-500 block">Gold Rate/g</span> <span className="text-gray-900">₹{transaction.gold_rate_per_gram.toLocaleString('en-IN')}</span></div>
                <div><span className="text-gray-500 block">Making Chg.</span> <span className="text-gray-900">₹{transaction.making_charges.toLocaleString('en-IN')}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Grand Total:</span>
                  <span>₹{transaction.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Payments Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Payments</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Amount:</span>
                  <span className="font-medium">₹{transaction.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Paid:</span>
                  <span className="font-medium text-green-600">₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Balance:</span>
                  <span className={balanceDue > 0 ? "text-red-600" : "text-gray-900"}>
                    ₹{balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {balanceDue > 0 ? (
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2 text-sm">
                    <PlusCircle size={16} /> Add Payment
                  </h3>
                  <PaymentForm transactionId={transaction.id} />
                </div>
              ) : (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center text-sm font-medium border border-green-100">
                  Fully Paid
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Payment History</h3>
              {payments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No payments yet.</p>
              ) : (
                <ul className="space-y-3">
                  {payments.map((p: any) => (
                    <li key={p.id} className="text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between font-medium text-gray-900">
                        <span>₹{Number(p.amount_paid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        <div className="flex gap-2 items-center">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">{p.payment_method}</span>
                          <Link href={`/receipt/${p.id}?mode=admin`} className="text-indigo-600 hover:text-indigo-900 ml-2" title="View Receipt">
                            <ReceiptText size={16} />
                          </Link>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(p.payment_date).toLocaleString('en-IN')}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
