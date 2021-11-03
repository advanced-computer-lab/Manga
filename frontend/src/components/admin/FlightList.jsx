import React, { useCallback, useEffect, useState } from 'react';
import { Search } from '../shared/UIKit/Inputs';
import { useHttpClient } from '../../hooks/http-hook';
import months from '../../utils/months';
import { useAdminDashboard } from '../context/AdminDashboardContext';

const FlightList = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [flights, setFlights] = useState([]);
  const { selectFlight } = useAdminDashboard();

  useEffect(() => {
    const fetchAndSetFlights = async () => {
      try {
        const response = await sendRequest('/flight');
        if (response && response.data) {
          setFlights(response.data);
        }
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAndSetFlights();
  }, [sendRequest, setFlights]);

  const onResponse = useCallback(flights => {
    setFlights(flights);
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='w-full p-4 bg-white rounded-xl shadow-xl'>
      <div className='flex items-center'>
        <h1>All flights</h1>
        <div className='w-3/12 ml-auto'>
          <Search
            placeholder='Search using flight number or airport terminals...'
            url='/flight/search'
            onResponse={onResponse}
          />
        </div>
      </div>
      <table className='table-auto w-full'>
        <thead style={{ background: '#fafafa' }}>
          <tr>
            <th scope='col' className='p-2 pl-0 text-left'>
              Flight Number
            </th>
            <th scope='col' className='p-2 pl-0 text-left'>
              Departure Time
            </th>
            <th scope='col' className='p-2 pl-0 text-left'>
              Arrival Time
            </th>
            <th scope='col' className='p-2 pl-0 text-left'>
              Departure Terminal
            </th>
            <th scope='col' className='p-2 pl-0 text-left'>
              Arrival Terminal
            </th>
            <th scope='col' className='p-2 pl-0 text-left'>
              Economy Seats
            </th>
            <th scope='col' className='p-2 pl-0 text-left'>
              Busines Seats
            </th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {flights.map(flight => {
            const departureTime = new Date(flight.departureTime);
            const arrivalTime = new Date(flight.arrivalTime);
            return (
              <tr
                key={flight._id}
                className='hover:bg-blue-500 hover:bg-opacity-10 hover:cursor-pointer'
                onClick={() => selectFlight(flight)}
              >
                <td className='py-2'>{flight.flightNumber}</td>
                <td className='py-2'>{`${departureTime.getDay()}-${
                  months[departureTime.getMonth()]
                }-${departureTime.getFullYear()} ${departureTime.getHours()}:${
                  departureTime.getMinutes() < 10 ? 0 : ''
                }${departureTime.getMinutes()}`}</td>
                <td className='py-2'>{`${arrivalTime.getDay()}-${
                  months[arrivalTime.getMonth()]
                }-${arrivalTime.getFullYear()} ${arrivalTime.getHours()}:${
                  arrivalTime.getMinutes() < 10 ? 0 : ''
                }${arrivalTime.getMinutes()}`}</td>
                <td className='py-2'>{flight.departureTerminal}</td>
                <td className='py-2'>{flight.arrivalTerminal}</td>
                <td className='py-2'>{flight.economySeats}</td>
                <td className='py-2'>{flight.businessSeats}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FlightList;
