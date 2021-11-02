import React from 'react'
import { Bar } from 'react-chartjs-2'

export default function ShowHistogram(props){
    const {data} = props;

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
    const config = {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: [
                { x: 1, y: 10 },
                { x: 3, y: 20 },
                { x: 5, y: 30 },
                { x: 7, y: 25 },
                { x: 8, y: 15 }
            ],
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

    return (
        <Bar data={config} options={options}/>
    )
}
