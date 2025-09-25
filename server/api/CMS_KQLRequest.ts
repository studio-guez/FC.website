export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig(event)


  const email = config.apiAuthEmail
  const password = config.apiAuthPassword

  const authHeader = Buffer.from(`${email}:${password}`).toString('base64')

  const body = await readBody(event)

  const dataApi = await $fetch(`${config.apiUrl}/api/query`, {
    lazy: true,
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authHeader}`
    },
    body,
  })

  console.log('dataApi', dataApi)
  console.log('API_URL:', config.apiUrl)

  return dataApi
})


