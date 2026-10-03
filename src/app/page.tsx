import { Dashboard } from '@/components/Dashboard'
import { createClient } from '@/utils/supabase/server'
import { GoldTransaction } from '@/types'

export default async function Home() {
  const supabase = await createClient()

  const { data: transactions, error } = await supabase
    .from('gold_transactions')
    .select('*, customers(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
  }

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gold Shop CRM</h1>
            <p className="text-gray-500 mt-1">Manage your transactions and customers easily.</p>
          </div>
        </header>
        <Dashboard initialTransactions={(transactions as any) || []} />
      </div>
    </main>
  )
}
