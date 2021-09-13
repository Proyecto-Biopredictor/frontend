import axios from 'axios';

const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
  };
const bioprocessURL = 'https://backend-ic7841.herokuapp.com/api/private/bioprocess';


export const getBioprocesses = async (id) => {
    id = id || '';
    return await axios.get(`${bioprocessURL}/${id}`, config);
}

export const addBioprocess = async (bioprocess) => {
    return await axios.post(`${bioprocessURL}/add`, bioprocess, config);
}

export const deleteBioprocess = async (id) => {
    return await axios.delete(`${bioprocessURL}/${id}`, config);
}

export const editBioprocess = async (id, bioprocess) => {
    return await axios.patch(`${bioprocessURL}/${id}`, bioprocess, config)
}