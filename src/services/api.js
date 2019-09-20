import axios from 'axios';
import qs from 'qs';

axios.defaults.timeout = 60000;
const root = process.env.PORT ? '/' : 'http://localhost:8084';

/**
 * Helper function to do actual API call.
 */
export function makeAPICall(url, method, data = {}, isFormData = false) {
  const options = {
    method,
    headers: {
      'content-type': isFormData ? 'application/x-www-form-urlencoded' : 'application/json',
    },
    data: isFormData ? qs.stringify(data) : data,
    url,
  };
  return axios.request(options).then((res) => res.data);
}
/**
 * Helper function to do actual API call.
 */
export function getAPI(path, data = {}, isFormData = false) {
  return makeAPICall(root + path, 'GET', data, isFormData);
}

/**
 * Helper function to do actual API call.
 */
export function postAPI(path, data = {}, isFormData = false) {
  return makeAPICall(root + path, 'POST', data, isFormData);
}

/*
 * API Object.
 */
const api = {};

export default api;
