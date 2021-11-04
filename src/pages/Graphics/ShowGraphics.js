import React, { useEffect, useState } from 'react'
import axios from "axios";
import Container from '@material-ui/core/Container';
import ShowBoxplot from './ShowBoxplot';
import ShowHistogram from './ShowHistogram';

function ShowGraphics() {
    const [error, setError] = useState('');
    const [data, setData] = useState({});
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getData() {
        try {
            const result = await axios.get(
                `https://backend-ic7841.herokuapp.com/api/private/record/num/${"61493deaf82f050016417dd6"}/${"61493ee9f82f050016417e0c"}`,
                config
            );
            setData(result.data);
        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setError("");
                }, 2000);
            }, 5000);
            return setError("Authentication failed!");
        }
    }

    let boxplot;
    useEffect(() => {
        let unmounted = false;
        getData();
        return () => { unmounted = true; };
    }, []);

    return (
        <Container>
            <ShowHistogram data={data} />
            <ShowBoxplot data={data} />
        </Container>
    )
}

export default ShowGraphics;
