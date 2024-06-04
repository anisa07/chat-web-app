import type { UserData } from '@/types/UserData'
import axios from 'axios'

const url = import.meta.env.VITE_SERVICE_URL

export const createUser = (user: UserData) =>
  axios.post(`${url}/users`, user).then((response) => response.data)

export const updateUser = (user: UserData) =>
  axios.put(`${url}/users/${user.userId}`, user).then((response) => response.data)

export const getUser = (
  userId: string
): Promise<{
  message: string
  data: UserData
}> => axios.get(`${url}/users/${userId}`).then((response) => response.data)

export const findUserByName = (userName: string) =>
  axios.get(`${url}/users/?name=${userName}`).then((response) => response.data)
