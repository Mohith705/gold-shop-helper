'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Printer } from 'lucide-react'

export function ReportsFilter({ initialFrom, initialTo }: { initialFrom: string, initialTo: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)

  const handleApply = () => {
    const params = new URLSearchParams(searchParams)
    params.set('from', from)
    params.set('to', to)
    router.push(`/reports?${params.toString()}`)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
        <input 
          type="date" 
          value={from} 
          onChange={(e) => setFrom(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
        <input 
          type="date" 
          value={to} 
          onChange={(e) => setTo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
        <button 
          onClick={handleApply}
          className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Apply Filter
        </button>
        <button 
          onClick={handlePrint}
          className="flex-1 sm:flex-none bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Printer size={16} /> Print Summary
        </button>
        <button 
          onClick={() => router.push(`/reports/bills?from=${from}&to=${to}`)}
          className="flex-1 sm:flex-none bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          Download All Bills
        </button>
      </div>
    </div>
  )
}
