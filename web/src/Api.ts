
export async function createLinkToken(): Promise<string> {
  const response = await fetch('/api/create_link_token', {
    method: 'POST',
    credentials: "same-origin",
  })
  if (response.ok) {
    return await response.text()
  }
  throw new Error(response.statusText)
}

export async function createAccessToken(publicToken: string): Promise<void> {
  const body = JSON.stringify({ public_token: publicToken })
  const headers = { 'Content-Type': 'application/json' }
  await fetch('/api/get_access_token', { method: 'POST', headers, body })
}