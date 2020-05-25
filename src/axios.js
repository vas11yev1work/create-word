import axios from 'axios'

const baseDomain = 'https://1lyceum.ru/'

const Axios = axios.create({
    baseURL: baseDomain,
    crossDomain: true
})

export {
    Axios
}
