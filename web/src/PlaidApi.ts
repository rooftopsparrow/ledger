
export enum IsoCurrencyCode {
    USD = "USD"
}
  
enum PlaidProducts {
    AUTH = "auth",
    ASSETS = "assets",
    BALANCE = "balance",
    CREDIT = "credit_details",
    IDENTITY = "identity",
    INCOME = "income",
    INVESTMENTS = "investments",
    LIABILITIES = "liabilities",
    TRANSACTIONS = "transactions"
}

export interface PlaidError {
    request_id: string 
    error_type: string 
    error_code: string 
    error_message: string 
    display_message: string 
    StatusCode: number
}

export interface PlaidItem {
    available_products: Array<PlaidProducts>
    billed_products: Array<PlaidProducts>
    error: PlaidError
    institution_id: string
    item_id: string
    webhook: string
    consent_expiration_time: string
}
  
export interface Balances {
    available: number,
    current: number,
    limit: number,
    envelopes: number,
    safe_to_spend: number
    iso_currency_code: IsoCurrencyCode,
    unofficial_currency_code: string
}

export interface AccountSummary {
    id: string,
    mask: string
    name: string
    subtype: string
    type: string
}
  
export interface Account {
    account_id: string
    balances: Balances
    mask: string
    name: string
    official_name: string
    subtype: string
    type: string,
    verification_status: string
}

export interface Institution {
    institution_id: string
    name: string
}

export interface Geo {
    address: string
    city: string
    lat: number 
    lon: number 
    region: string
    store_number: string
    postal_code: string
    country: string
}

export interface PaymentInfo {
    by_order_of: string 
    payee: string 
    payer: string 
    payment_method: string 
    payment_processor: string 
    ppd_id: string 
    reason: string 
    reference_number: string
}

export interface Transaction {
    account_id: string
    amount: number 
    iso_currency_code: IsoCurrencyCode
    unofficial_currency_code: string
    category: Array<string>
    category_id: string
    date: string
    authorized_date: string 
    location: Geo
    merchant_name: string
    name: string
    payment_meta: PaymentInfo
    payment_channel: string
    pending: boolean,
    pending_transaction_id: string
    account_owner: string 
    transaction_id: string,
    transaction_type: string
    transaction_code: string
}
 
export type TransactionsResponse = {
    accounts: Array<Account>,
    item: PlaidItem,
    request_id: string,
    total_transactions: number,
    transactions: Array<Transaction>
}

export interface Envelope {
    name: string
    balance: number
    notes: string
}

export async function createLinkToken(): Promise<string> {
    const response = await fetch('/api/create_link_token', {
      method: 'POST',
      credentials: "same-origin",
    })
    if (response.ok) {
      return response.text()
    }
    throw new Error(response.statusText)
  }
  
  export async function createAccessToken(publicToken: string): Promise<string> {
    const body = JSON.stringify({ public_token: publicToken })
    const headers = { 'Content-Type': 'application/json' }
    const response = await fetch('/api/get_access_token', { method: 'POST', headers, body })
    if (response.ok) {
      return response.text()
    }
    throw new Error(response.statusText)
  }