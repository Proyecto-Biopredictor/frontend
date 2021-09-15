import axios from 'axios';

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
};
const FactorURL = 'https://backend-ic7841.herokuapp.com/api/private/factor';


export const getFactor = async (id) => {
    try {
        id = id || '';
        return await axios.get(`${FactorURL}/${id}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const addFactor = async (Factor) => {
    try {
        return await axios.post(`${FactorURL}/`, Factor, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const deleteFactor = async (id) => {
    try {
        return await axios.delete(`${FactorURL}/${id}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const editFactor = async (id, Factor) => {
    try {
        return await axios.patch(`${FactorURL}/${id}`, Factor, config)
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}