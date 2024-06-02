import axios from 'axios'

const url = import.meta.env.VITE_SERVICE_URL

export const createUserToken = (userId: string) =>
  axios.post(`${url}/auth`, { userId }).then((response) => response.data)

export const verifyUserToken = ({ userId, token }: { userId: string; token: string }) =>
  axios
    .get(`${url}/auth/${userId}`, {
      headers: {
        token
      }
    })
    .then((response) => response.data)

export const deleteUserToken = (userId: string) =>
  axios.delete(`${url}/auth/${userId}`).then((response) => response.data)
