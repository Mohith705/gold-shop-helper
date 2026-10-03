'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCustomerAndTransaction(formData: FormData) {
  const supabase = await createClient()

  const customerName = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  const itemName = formData.get('item_name') as string
  const weightGrams = parseFloat(formData.get('weight_grams') as string)
  const wastagePercentage = parseFloat(formData.get('wastage_percentage') as string)
  const ratePerGram = parseFloat(formData.get('gold_rate_per_gram') as string)
  const makingCharges = parseFloat(formData.get('making_charges') as string || '0')
  const amountPaid = parseFloat(formData.get('amount_paid') as string || '0')
  const paymentMethod = formData.get('payment_method') as string || 'Cash'

  // Insert Customer
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .insert({ name: customerName, phone, address })
    .select('id')
    .single()

  if (customerError || !customer) {
    return { error: customerError?.message || 'Failed to create customer' }
  }

  // Calculate fields
  const netWeight = weightGrams + (weightGrams * (wastagePercentage / 100))
  const taxableAmount = (netWeight * ratePerGram) + makingCharges
  const cgstAmount = taxableAmount * 0.015 // 1.5%
  const sgstAmount = taxableAmount * 0.015 // 1.5%
  const totalAmount = taxableAmount + cgstAmount + sgstAmount

  // Insert Transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('gold_transactions')
    .insert({
      customer_id: customer.id,
      item_name: itemName,
      weight_grams: weightGrams,
      wastage_percentage: wastagePercentage,
      gold_rate_per_gram: ratePerGram,
      making_charges: makingCharges,
      net_weight: netWeight,
      taxable_amount: taxableAmount,
      cgst_amount: cgstAmount,
      sgst_amount: sgstAmount,
      total_amount: totalAmount
    })
    .select('id')
    .single()

  if (transactionError || !transaction) {
    return { error: transactionError?.message || 'Failed to create transaction' }
  }

  // Insert Payment if amount > 0
  if (amountPaid > 0) {
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        transaction_id: transaction.id,
        amount_paid: amountPaid,
        payment_method: paymentMethod
      })

    if (paymentError) {
      return { error: paymentError.message }
    }
  }

  revalidatePath('/')
  return { success: true, transactionId: transaction.id }
}
