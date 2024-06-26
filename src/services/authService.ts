import axios from 'axios'

const url = import.meta.env.VITE_SERVICE_URL

export const verifyUserToken = () =>
  axios.post(`${url}/auth/verifyToken`).then((response) => response.data)
