import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Lock } from 'lucide-react'

async function handleLogin(formData: FormData) {
  'use server'
  const username = formData.get('username')
  const password = formData.get('password')

  if (username === 'raja' && password === 'gold1987') {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    redirect('/')
  } else {
    redirect('/login?error=invalid')
  }
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-indigo-600">
          <Lock size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Lakshmi Suma Jewellery
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form action={handleLogin} className="space-y-6">
            {resolvedSearchParams?.error === 'invalid' && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md text-center">
                Invalid username or password
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1">
                <input
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
