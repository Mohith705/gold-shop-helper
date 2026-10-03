import { AddEntryForm } from './AddEntryForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddEntryPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex flex-col gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-900 inline-flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">New Gold Transaction</h1>
            <p className="text-gray-500 text-sm mt-1">Enter customer details and transaction information to generate a bill.</p>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <AddEntryForm />
        </div>
      </div>
    </main>
  )
}
