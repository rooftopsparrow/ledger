
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