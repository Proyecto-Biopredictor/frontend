import FileManager from '../components/FileManager';
import Register from '../components/Register';
import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import React from 'react'

const Home = ({ history }) => {
  
    const [error, setError] = useState("");
    const [privateData, setPrivateData] = useState("");
    const history2 = useHistory();
  
    useEffect(() => {
        const fetchPrivateDate = async () => {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          };
    
          try {
            const { data } = await axios.get("/api/private", config);
            setPrivateData(data.data);
          } catch (error) {
            localStorage.removeItem("authToken");
            setError("You are not authorized please login");
            history2.push('/login');
          }
        };
    
        fetchPrivateDate();
      }, [history]);
    
    return (
        <div>
            <FileManager />
            <Register />
        </div>
    )
}

export default Home;