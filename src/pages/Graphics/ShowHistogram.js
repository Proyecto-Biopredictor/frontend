import React from 'react'
import { Bar } from 'react-chartjs-2'

export default function ShowHistogram(props) {
    const { data } = props;

    const options = {
        scales: {
            x: {
                type: 'linear'
            },
            y: {
                beginAtZero: true
            }
        }
    };

    const labels = ["red"];
    let configs = [];

    for (let key in data) {
        if(key === "isFull"){
            break;
        }
        let dataVariable = Array.from(data[key]);
        dataVariable.sort(function(a, b){return a-b});

        let parseData = [];

        while(dataVariable.length > 0){
            let count = dataVariable.reduce((a, v) => (v === dataVariable[0] ? a + 1 : a), 0);

            parseData.push({x: dataVariable[0], y: count});

            dataVariable.splice(0, count);
        }
        const config = {
            labels: labels,
            datasets: [{
                label: key,
                data: parseData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        };
        configs.push(config);
    }

    return (
        <div>
            {configs.map((config, index) => (
                <Bar data={config} options={options} />
            ))}
        </div>
    )
}
