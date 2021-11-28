import React from 'react';

import moment from 'moment';

import EgyptAirLogo from '../../assets/images/egypt-air-logo.png';

const FlightCard = ({
  id,
  flightNumber,
  departureTime,
  arrivalTime,
  duration,
  economySeats,
  businessSeats,
  price,
}) => {
  return (
    <div className='w-full grid grid-cols-12 border-b-1 border-pale-purple last:border-b-0 py-3 px-4 hover:bg-hover hover:cursor-pointer '>
      <div className='col-span-1 flex justify-center items-center'>
        <img src={EgyptAirLogo} alt='Egypt Air' />
      </div>
      <div className='col-span-2 flex items-center'>
        <span className='text-grey-secondary leading-5'>{flightNumber}</span>
      </div>
      <div className='col-span-2 flex flex-col justify-around'>
        <span className='text-grey-4 font-nunito leading-5 mb-1'>
          {moment(departureTime).format('DD MMM')} Departing
        </span>
        <span className='text-grey-4 font-nunito leading-5'>
          {moment(arrivalTime).format('DD MMM')} Arriving
        </span>
      </div>
      <div className='col-span-2 flex flex-col justify-around'>
        <span className='text-grey-4 font-nunito leading-5 mb-1 text-right'>
          {moment(departureTime).format('hh:mm a')} -{' '}
          {moment(arrivalTime).format('hh:mm a')}
        </span>
        <span className='font-nunito text-right w-full text-grey-secondary leading-5'>
          {Math.floor(duration / 60)} hrs {duration % 60} mins
        </span>
      </div>
      <div className='col-span-2 flex flex-col justify-around'>
        <span className='text-grey-4 font-nunito leading-5 mb-1 text-right'>
          Business Cabin
        </span>
        <span className='font-nunito text-right w-full text-grey-secondary leading-5'>
          {businessSeats || 'N/A'} seats
        </span>
      </div>
      <div className='col-span-2 flex flex-col justify-around'>
        <span className='text-grey-4 font-nunito leading-5 mb-1 text-right'>
          Economy Cabin
        </span>
        <span className='font-nunito text-right w-full text-grey-secondary leading-5'>
          {economySeats || 'N/A'} seats
        </span>
      </div>
      <div className='col-span-1 flex flex-col justify-around'>
        <span className='text-grey-4 font-nunito leading-5 mb-1 text-right'>Price</span>
        <span className='font-nunito text-right w-full text-grey-secondary leading-5'>
          EGP {price}
        </span>
      </div>
    </div>
  );
};

export default FlightCard;
