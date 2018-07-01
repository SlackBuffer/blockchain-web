import axios from 'axios';

const api = process.env.REACT_APP_RECORDS_API_URL || 'localhost://4000';

export const getAllRecords = () => {
  return axios.get(`${api}/api/v1/records`);
}

export const newRecord = (id, body) => 
  axios.post(`${api}/api/v1/records`, body);

export const updateRecord = (id, body) => 
  axios.put(`${api}/api/v1/records/${id}`, body);
  
export const remove = id => 
  axios.delete(`${api}/api/v1/records/${id}`);