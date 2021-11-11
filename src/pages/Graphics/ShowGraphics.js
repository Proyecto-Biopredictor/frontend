import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios";
import Container from '@material-ui/core/Container';
import ShowBoxplot from './ShowBoxplot';
import ShowHistogram from './ShowHistogram';

function ShowGraphics() {
    const { pid, bid } = useParams();
    const [error, setError] = useState('');
    const [data, setData] = useState({"isFull": false});
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    async function getData() {
        try {
            const result = await axios.get(
                `https://backend-ic7841.herokuapp.com/api/private/record/num/${bid}/${pid}`,
                config
            );
            result.data.isFull = true;
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
            {data.isFull && <div>
                <ShowBoxplot data={data} />
            </div>}
        </Container>
    )
}

export default ShowGraphics;
