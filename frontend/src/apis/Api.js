import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:3000"
})


const ApiUsers = axios.create({
  baseURL: "http://localhost:4001"
})

const ApiProducts = axios.create({
  baseURL: "http://localhost:4002"
})

const ApiProfiles = axios.create({
  baseURL: "http://localhost:4003"
})

export { Api, ApiProducts, ApiUsers, ApiProfiles };