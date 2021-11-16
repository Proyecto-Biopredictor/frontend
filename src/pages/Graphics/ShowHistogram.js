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
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function() {},
                    label: function(context) {
                        let index = context.dataIndex;
                        let dataset = context.dataset.data;
                        let interval = "Intervalo: [";
                        interval += dataset[index - 1].x;
                        interval += ", " + context.parsed.x + "[";
                        let frequence = "Frecuencia: " + context.parsed.y;
                        return [interval, frequence];
                    }
                }
            }
        }
    };

    let configs = [];

    for (let key in data) {
        if (key === "isFull") {
            break;
        }
        let dataVariable = Array.from(data[key]);
        dataVariable.sort(function (a, b) { return a - b });

        let classes = Math.sqrt(dataVariable.length);
        let amplitude = 0;
        let range = 0;

        let parseData = [];
        if (classes > 0) {
            range = dataVariable.at(-1) - dataVariable.at(0);
            if (classes !== 0) {
                amplitude = Math.round(range / classes);
            }
            let interval = Math.round(dataVariable[0] + amplitude);
            for (let index = 0; index < dataVariable.length; index++) {
                let frequence = 0;
                while (dataVariable[index] < interval) {
                    frequence++;
                    index++;
                }
                parseData.push({ x: interval, y: frequence });
                interval += amplitude;
            }
        }

        const config = {
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
