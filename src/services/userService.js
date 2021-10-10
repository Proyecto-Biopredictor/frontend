import axios from 'axios';

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
};
const userURL = 'https://backend-ic7841.herokuapp.com/api/private/users';


export const getUsers = async (id) => {
    try {
        id = id || '';
        return await axios.get(`${userURL}/${id}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const getAllUsers = async (id) => {
    try {
        id = id || '';
        return await axios.get('https://backend-ic7841.herokuapp.com/api/private/allUsers', config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const addUser = async (user) => {
    try {
        return await axios.post(`${userURL}/`, user, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const deleteUser = async (id) => {
    try {
        return await axios.delete(`${userURL}/${id}`, config);
    } catch (error) {
        throw Error(error?.response?.data?.error);
    }
}

export const editUser = async (id, user) => {
    try {
        return await axios.patch(`${userURL}/${id}`, user, config)
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}