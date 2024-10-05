import {useEffect, useState} from "react";
import { Chart } from 'primereact/chart';
import { TabView, TabPanel } from 'primereact/tabview';
import { RadioButton } from "primereact/radiobutton";
import {GetArrayByUrl} from "../utils";
import {InputNumber} from "primereact/inputnumber";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import moment from "moment/moment";

async function RequestData(requestUrl, dateStart, dateEnd) {
    try {
        const body = new FormData();
        body.append("dateStart", dateStart);
        body.append("dateEnd", dateEnd);

        const response = await fetch(`http://localhost:5257/reports/${requestUrl}`, {
            method: 'POST',
            body: body,
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        const data = JSON.parse(text);

        console.log('Пришло: ' + text);
        return data; // Возвращаем данные
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

// вывод продаж по жанрам книг
function SelectAmountSalesGeners(){
    const moment = require("moment");

    // пример получения текущей даты
    const [today, setToday] = useState(moment().format("YYYY-MM-DD"));

    const [dateEnd, setDateEnd] = useState('');
    const [dateArea, setDateArea] = useState('week');
    const [result, setResult] = useState([]);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await RequestData('SelectAmountSalesGeners', today, dateEnd);
                setResult(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if(dateEnd.length === 10) fetchData();
    }, [dateEnd]);

    useEffect(() => {
        const data = {
            labels: result.map((res) => {
                return res.genreName;
            }),
            datasets: [
                {
                    label: 'Продажи',
                    data: result.map((res) => {
                        return res.amount;
                    }),
                    borderWidth: 1
                }
            ]
        };
        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    },[result])


    useEffect(() => {
        switch (dateArea){
            case 'week':{
                const date = moment().subtract(7, "days");
                setDateEnd(date.format("YYYY-MM-DD"));
                break;
            }
            case 'month':{
                const date = moment().subtract(1, "month");
                setDateEnd(date.format("YYYY-MM-DD"));
                break;
            }
            case 'year':{
                const date = moment().subtract(1, "year");
                setDateEnd(date.format("YYYY-MM-DD"));
                break;
            }
            default:
                break;

        }
    }, [dateArea])

    const ShowPie = () => {
        return (result.length === 0) ?
            (<p className="text-center">
                Не достаточно данных :(
            </p>) :
            (<>
                <div className="card flex justify-content-center">
                    <Chart type="pie"
                           data={chartData}
                           options={chartOptions}
                           className="w-full md:w-30rem"
                    />
                </div>
                <p className="text-center">
                    Итого: {result.map((res) => res.amount)
                    .reduce((psum, amount) => psum += amount, 0)} шт.
                </p>
            </>)
    }
    // используется для redirect
    const navigate = useNavigate();

    const [cookies] = useCookies(['currentUser', 'currentUserRole']);

    if (cookies.currentUserRole !== 'admin') navigate('/');

    return (
        <>
            <div className="flex flex-wrap gap-3 my-2 justify-content-center">
                <div className="flex align-items-center">
                    <p>Продажи за:</p>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="week"
                                 name="datearea"
                                 value="week"
                                 onChange={(e) => setDateArea(e.value)}
                                 checked={dateArea === 'week'}/>
                    <label htmlFor="week" className="ml-2">Неделя</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="month"
                                 name="datearea"
                                 value="month"
                                 onChange={(e) => setDateArea(e.value)}
                                 checked={dateArea === 'month'}/>
                    <label htmlFor="month" className="ml-2">Месяц</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="year"
                                 name="datearea"
                                 value="year"
                                 onChange={(e) => setDateArea(e.value)}
                                 checked={dateArea === 'year'}/>
                    <label htmlFor="year" className="ml-2">Год</label>
                </div>
            </div>
            <ShowPie/>
        </>
    )
}

// вывод продаж за текущий год (количество и сумма проданных книг)
function SelectSalesByCurYear() {
    const [result, setResult] = useState([]);
    const [chartDataAmount, setChartDataAmount] = useState({});
    const [chartDataPrice, setChartDataPrice] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setResult(await GetArrayByUrl('http://localhost:5257/reports/SelectSalesByCurYear'));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const dataAmount = {
            labels: result.map((res) => {
                return res.month;
            }),
            datasets: [
                {
                    label: 'Продажи(шт.)',
                    data: result.map((res) => {
                        return res.amount;
                    }),
                    borderWidth: 1
                }
            ]
        };
        const dataPrice = {
            labels: result.map((res) => {
                return res.month;
            }),
            datasets: [
                {
                    label: 'Продажи(руб.)',
                    data: result.map((res) => {
                        return res.price;
                    }),
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartDataAmount(dataAmount);
        setChartDataPrice(dataPrice);
        setChartOptions(options);
    },[result]);

    return(
        <>
            <div className="grid" style={{height: '90vh'}}>
                <div className="col mx-3">
                    <Chart type="bar"
                           data={chartDataAmount}
                           options={chartOptions}
                    />
                    <p className="text-center">
                        Итого: {result.map((res) => res.amount)
                        .reduce((psum, amount) => psum += amount, 0)} шт.
                    </p>
                </div>
                <div className="col mx-3">
                    <Chart type="bar"
                           data={chartDataPrice}
                           options={chartOptions}
                    />
                    <p className="text-center">
                        Итого:
                        <InputNumber value={result.map((res) => res.price).reduce((psum, price) => psum += price, 0)}
                                     mode="currency"
                                     currency="RUB"
                                     locale="ru-RU"
                                     className="w-5rem"
                                     readOnly
                        />
                    </p>
                </div>
            </div>
        </>
    )
}

// вывод закупок за текущий год (количество и сумма проданных книг)
function SelectPurchaseByCurYear() {
    const [result, setResult] = useState([]);
    const [chartDataAmount, setChartDataAmount] = useState({});
    const [chartDataPrice, setChartDataPrice] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setResult(await GetArrayByUrl('http://localhost:5257/reports/SelectPurchaseByCurYear'));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const dataAmount = {
            labels: result.map((res) => {
                return res.month;
            }),
            datasets: [
                {
                    label: 'Закупки (шт.)',
                    data: result.map((res) => {
                        return res.amount;
                    }),
                    borderWidth: 1
                }
            ]
        };
        const dataPrice = {
            labels: result.map((res) => {
                return res.month;
            }),
            datasets: [
                {
                    label: 'Закупки (руб.)',
                    data: result.map((res) => {
                        return res.price;
                    }),
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    borderWidth: 1
                }
            ]
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        setChartDataAmount(dataAmount);
        setChartDataPrice(dataPrice);
        setChartOptions(options);
    },[result]);

    return(
        <>
            <div className="grid" style={{height: '90vh'}}>
                <div className="col mx-3">
                    <Chart type="bar"
                           data={chartDataAmount}
                           options={chartOptions}
                    />
                    <p className="text-center">
                        Итого: {result.map((res) => res.amount)
                        .reduce((psum, amount) => psum += amount, 0)} шт.
                    </p>
                </div>
                <div className="col mx-3">
                    <Chart type="bar"
                           data={chartDataPrice}
                           options={chartOptions}
                    />
                    <p className="text-center">
                        Итого:
                        <InputNumber value={result.map((res) => res.price).reduce((psum, price) => psum += price, 0)}
                                     mode="currency"
                                     currency="RUB"
                                     locale="ru-RU"
                                     className="w-5rem"
                                     readOnly
                        />
                    </p>
                </div>
            </div>
        </>
    )
}


export default function ShowReports() {
    return (
        <TabView className="m-2">
            <TabPanel header="Подажи жанров">
                <h2 className="text-center my-3">Количество проданных книг по жанрам</h2>
                <SelectAmountSalesGeners/>
            </TabPanel>
            <TabPanel header="Закупки">
                <h2 className="text-center my-3">Количество и сумма закупок за текущий год</h2>
                <SelectPurchaseByCurYear/>
            </TabPanel>
            <TabPanel header="Продажи">
                <h2 className="text-center my-3">Количество и сумма продаж за текущий год</h2>
                <SelectSalesByCurYear/>
            </TabPanel>
        </TabView>
    )
}