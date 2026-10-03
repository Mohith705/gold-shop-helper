'use client'

import { GoldTransaction } from '@/types'
import Link from 'next/link'
import { PlusCircle, ReceiptText, User } from 'lucide-react'

export function Dashboard({ initialTransactions }: { initialTransactions: GoldTransaction[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
        <Link 
          href="/add-entry" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <PlusCircle size={18} />
          <span>New Entry</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {initialTransactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ReceiptText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">No transactions found</p>
            <p className="mt-1">Get started by creating a new entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Weight (g)</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 p-2 rounded-full text-indigo-600">
                          <User size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{tx.customers?.name}</div>
                          <div className="text-xs text-gray-500">{tx.customers?.phone || 'No phone'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">{tx.item_name}</td>
                    <td className="p-4 text-gray-600">{tx.weight_grams}g</td>
                    <td className="p-4 font-semibold text-gray-900">₹{tx.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(tx.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/bill/${tx.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <ReceiptText size={16} />
                        View Bill
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
