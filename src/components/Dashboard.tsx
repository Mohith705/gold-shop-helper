'use client'

import { GoldTransaction } from '@/types'
import Link from 'next/link'
import { PlusCircle, ReceiptText, User, Search, Filter } from 'lucide-react'
import { useState } from 'react'

export function Dashboard({ initialTransactions }: { initialTransactions: GoldTransaction[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')

  // Filter and sort transactions
  const filteredTransactions = initialTransactions.filter(tx => {
    const query = searchQuery.toLowerCase()
    return (
      tx.customers?.name?.toLowerCase().includes(query) ||
      tx.customers?.phone?.toLowerCase().includes(query) ||
      tx.item_name.toLowerCase().includes(query)
    )
  }).sort((a, b) => {
    if (sortBy === 'date_desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (sortBy === 'date_asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    if (sortBy === 'amount_desc') return b.total_amount - a.total_amount
    if (sortBy === 'amount_asc') return a.total_amount - b.total_amount
    return 0
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
        <Link 
          href="/add-entry" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <PlusCircle size={18} />
          <span>New Entry</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name, phone, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-gray-400" size={18} />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer bg-white"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ReceiptText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">No transactions found</p>
            <p className="mt-1">Try adjusting your search or create a new entry.</p>
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
                {filteredTransactions.map((tx) => (
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
                    <td className="p-4 text-right space-x-4 whitespace-nowrap">
                      <Link 
                        href={`/transaction/${tx.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <User size={16} />
                        View
                      </Link>
                      <Link 
                        href={`/bill/${tx.id}?mode=admin`}
                        className="text-gray-500 hover:text-gray-900 text-sm font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <ReceiptText size={16} />
                        Bill
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
