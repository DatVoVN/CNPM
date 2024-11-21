import { BASE_URL } from '../../until'

const rootCustomers = `${BASE_URL}/customers`
const CustomersAPI = {
  getAllCustomers: async (token) =>
    await fetch(`${rootCustomers}/manage-users`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    }),
  addCustomers: async (data, token) =>
    await fetch(`${rootCustomers}/add-users`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: data
    }),
  updateCustomers: async (data, token) =>
    await fetch(`${rootCustomers}/update-profile`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: data
    }),
  deleteCustomers: async (id, token) =>
    await fetch(`${rootCustomers}/delete-user/${id}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      }
    }),
  searchCustomers: async (query, token) =>
    await fetch(`${rootCustomers}?${query}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
}

export default CustomersAPI
