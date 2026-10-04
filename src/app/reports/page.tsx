import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import { ReportsFilter } from './ReportsFilter'
import { format, startOfDay, endOfDay } from 'date-fns'

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ from?: string, to?: string }> }) {
  const supabase = await createClient()
  const params = await searchParams
  
  const fromDate = params.from || format(new Date(), 'yyyy-MM-dd')
  const toDate = params.to || format(new Date(), 'yyyy-MM-dd')

  const { data: transactions } = await supabase
    .from('gold_transactions')
    .select('*, customers(*), payments(*)')
    .gte('created_at', startOfDay(new Date(fromDate)).toISOString())
    .lte('created_at', endOfDay(new Date(toDate)).toISOString())
    .order('created_at', { ascending: false })

  const validTransactions = transactions || []

  const totalWeight = validTransactions.reduce((sum, t) => sum + (t.weight_grams || 0), 0)
  const totalSales = validTransactions.reduce((sum, t) => sum + (t.total_amount || 0), 0)
  
  const totalPayments = validTransactions.reduce((sum, t) => {
    const paid = t.payments?.reduce((pSum: number, p: any) => pSum + (p.amount_paid || 0), 0) || 0
    return sum + paid
  }, 0)

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Filter and export transaction receipts</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500 hover:text-gray-900 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft size={16} /> Dashboard
            </Link>
          </div>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0">
          <div className="print:hidden mb-6">
            <ReportsFilter initialFrom={fromDate} initialTo={toDate} />
          </div>

          <div className="hidden print:block mb-6">
            <h2 className="text-2xl font-bold text-center">Sales Report</h2>
            <p className="text-center text-gray-600">
              Period: {format(new Date(fromDate), 'dd MMM yyyy')} to {format(new Date(toDate), 'dd MMM yyyy')}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs print:bg-gray-100">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg print:rounded-none">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3 text-right">Weight (g)</th>
                  <th className="px-4 py-3 text-right">Total Amount (₹)</th>
                  <th className="px-4 py-3 text-right rounded-r-lg print:rounded-none">Paid (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {validTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No transactions found for the selected dates.
                    </td>
                  </tr>
                ) : (
                  validTransactions.map((t) => {
                    const paid = t.payments?.reduce((sum: number, p: any) => sum + (p.amount_paid || 0), 0) || 0
                    return (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-500">{format(new Date(t.created_at), 'dd MMM yyyy')}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{t.customers?.name}</td>
                        <td className="px-4 py-3 text-gray-700">{t.item_name}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{t.is_lump_sum ? '-' : t.weight_grams?.toFixed(3)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">{t.total_amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-medium">{paid.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
              {validTransactions.length > 0 && (
                <tfoot className="bg-gray-50 font-bold text-gray-900 print:bg-gray-100">
                  <tr>
                    <td colSpan={3} className="px-4 py-4 rounded-l-lg text-right print:rounded-none">TOTALS:</td>
                    <td className="px-4 py-4 text-right text-indigo-700">{totalWeight.toFixed(3)}</td>
                    <td className="px-4 py-4 text-right text-indigo-700">₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-4 text-right text-emerald-700 rounded-r-lg print:rounded-none">₹{totalPayments.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
