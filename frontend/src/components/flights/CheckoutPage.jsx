import React, { useEffect, useState } from 'react';
import { useReservation } from '../context/ReservationContext';
import { useHttpClient } from '../../hooks/http-hook';
import Loading from '../shared/UIKit/Loading';
// import { Button } from '../shared/UIKit/Buttons';
import FlightSummaryCard from './FlightSummaryCard';
// import { useHistory } from 'react-router-dom';
// import { remove } from '../../service/localStorage.service';

// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { stripeConfig } from '../../config/stripe.config';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(stripeConfig.pk);

const CheckoutPage = () => {
  const {
    departureFlight,
    returnFlight,
    departureFlightCabin,
    returnFlightCabin,
    departureFlightPassengers,
    returnFlightPassengers,
    // clear,
  } = useReservation();
  // const history = useHistory();
  const { sendRequest: sendDepartureRequest, isLoading: isDepartureLoading } =
    useHttpClient();
  const { sendRequest: sendReturnRequest, isLoading: isReturnLoading } = useHttpClient();
  const { sendRequest } = useHttpClient();

  const [departureFlightAvailableSeats, setDepartureFlightAvailableSeats] = useState([]);
  const [returnFlightAvailableSeats, setReturnFlightAvailableSeats] = useState([]);

  const [chosenDepartureSeats, setChosenDepartureSeats] = useState([]);
  const [chosenReturnSeats, setChosenReturnSeats] = useState([]);

  const [clientSecret, setClientSecret] = useState(null);

  const addDepartureSeat = seat => {
    setChosenDepartureSeats(seats => [...seats, seat]);
  };

  const removeDepartureSeat = seat => {
    setChosenDepartureSeats(seats => seats.filter(s => s !== seat));
  };

  const addReturnSeat = seat => {
    setChosenReturnSeats(seats => [...seats, seat]);
  };

  const removeReturnSeat = seat => {
    setChosenReturnSeats(seats => seats.filter(s => s !== seat));
  };

  const isDepartureSeat = seat => {
    const idx = chosenDepartureSeats.findIndex(s => s === seat);
    return idx >= 0;
  };

  const isReturnSeat = seat => {
    const idx = chosenReturnSeats.findIndex(s => s === seat);
    return idx >= 0;
  };

  const toggleDepartureSeat = seat => {
    if (isDepartureSeat(seat)) {
      removeDepartureSeat(seat);
    } else {
      if (chosenDepartureSeats.length === departureFlightPassengers) return;
      addDepartureSeat(seat);
    }
  };

  const toggleReturnSeat = seat => {
    if (isReturnSeat(seat)) {
      removeReturnSeat(seat);
    } else {
      if (chosenReturnSeats.length === returnFlightPassengers) return;
      addReturnSeat(seat);
    }
  };

  // const handleReserve = async () => {
  //   try {
  //     const response = await sendRequest('/reservation', 'POST', {
  //       departureFlightId: departureFlight,
  //       returnFlightId: returnFlight,
  //       departureFlightSeats: chosenDepartureSeats,
  //       returnFlightSeats: chosenReturnSeats,
  //       departureFlightCabin,
  //       returnFlightCabin,
  //     });
  //     if (response && response.data) {
  //       clear();
  //       remove('departureFlighCabin');
  //       remove('returnFlighCabin');
  //       remove('departureFlightPassengers');
  //       remove('returnFlightPassengers');
  //       remove('departureFlight');
  //       remove('returnFlight');
  //       history.push(`/itinerary/${response.data._id}`);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  useEffect(() => {
    const fetchDepartureFlightSeats = async () => {
      try {
        const response = await sendDepartureRequest(
          `/flight/seats/${departureFlight}`,
          'POST',
          {
            cabin: departureFlightCabin,
          }
        );
        if (response && response.data) {
          setDepartureFlightAvailableSeats(response.data);
        }
      } catch (err) {}
    };
    const fetchReturnFlightSeats = async () => {
      try {
        const response = await sendReturnRequest(
          `/flight/seats/${returnFlight}`,
          'POST',
          {
            cabin: returnFlightCabin,
          }
        );
        if (response && response.data) {
          setReturnFlightAvailableSeats(response.data);
        }
      } catch (err) {}
    };
    const fetchClientSecret = async () => {
      try {
        const response = await sendRequest(
          `/reservation/full-reservation-payment-secret`,
          'POST',
          {
            departureFlightId: departureFlight,
            returnFlightId: returnFlight,
            departureFlightPassengers,
            returnFlightPassengers,
          }
        );
        if (response?.data) {
          setClientSecret(response?.data.clientSecret);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (departureFlight) fetchDepartureFlightSeats();
    if (returnFlight) fetchReturnFlightSeats();
    if (departureFlight && returnFlight) fetchClientSecret();
  }, [
    departureFlight,
    departureFlightCabin,
    departureFlightPassengers,
    returnFlight,
    returnFlightCabin,
    returnFlightPassengers,
    sendDepartureRequest,
    sendRequest,
    sendReturnRequest,
  ]);

  return (
    <main className='CheckoutPage page px-16 pt-14'>
      <h3 className='text-2xl font-bold font-nunito leading-8 text-primary mb-4'>
        Checkout
      </h3>
      <div className='flex w-full'>
        <section className='w-1/3'>
          <h2 className='text-xl font-semibold font-nunito leading-6 text-grey-primary mb-4'>
            Step 1 - Choosing your seats
          </h2>
          <h3 className='text-lg leading-6 font-nunito text-grey-secondary mb-6'>
            Departure flight seats{' '}
            <span className='italic text-sm'>(choose {departureFlightPassengers})</span>
          </h3>
          {!isDepartureLoading ? (
            <div className='flex w-full flex-wrap'>
              {departureFlightAvailableSeats.map(
                (seat, idx) =>
                  seat && (
                    <span
                      onClick={() => toggleDepartureSeat(idx)}
                      className={`mr-3 mb-6 w-10 h-10 flex justify-center items-center rounded-full ${
                        isDepartureSeat(idx) ? 'bg-primary text-white' : 'bg-pale-purple'
                      } hover:cursor-pointer`}
                      key={`departureSeat${idx}`}
                    >
                      {departureFlightCabin === 'business' ? 'B' : 'E'}
                      {idx}
                    </span>
                  )
              )}
            </div>
          ) : (
            <div className='w-full flex justify-center items-center p-4'>
              <Loading sm />
            </div>
          )}
          <h3 className='text-lg font-nunito leading-6 text-grey-secondary mb-6'>
            Return flight seats{' '}
            <span className='italic text-sm'>(choose {returnFlightPassengers})</span>
          </h3>
          {!isReturnLoading ? (
            <div className='flex w-full flex-wrap'>
              {returnFlightAvailableSeats.map(
                (seat, idx) =>
                  seat && (
                    <span
                      onClick={() => toggleReturnSeat(idx)}
                      className={`mr-3 mb-6 w-10 h-10 flex justify-center items-center rounded-full ${
                        isReturnSeat(idx) ? 'bg-primary text-white' : 'bg-pale-purple'
                      } hover:cursor-pointer`}
                      key={`returnSeat${idx}`}
                    >
                      {returnFlightCabin === 'business' ? 'B' : 'E'}
                      {idx}
                    </span>
                  )
              )}
            </div>
          ) : (
            <div className='w-full flex justify-center items-center p-4'>
              <Loading sm />
            </div>
          )}
        </section>
        <section className='w-1/3'>
          <h2 className='text-xl font-semibold font-nunito leading-6 text-grey-primary mb-4'>
            Step 2 - Payment
          </h2>
          <p className='text-grey-secondary font-nunito text-lg leading-6 mb-6'>
            Manga Flights processes your payment securely with end-to-end encryption.
          </p>
          <h3 className='text-grey-primary font-nunito text-lg leading-6 mb-6'>
            Credit Card Details
          </h3>
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                chosenDepartureSeats={chosenDepartureSeats}
                chosenReturnSeats={chosenReturnSeats}
                departureFlightPassengers={departureFlightPassengers}
                returnFlightPassengers={returnFlightPassengers}
                departureFlight={departureFlight}
                returnFlight={returnFlight}
                departureFlightCabin={departureFlightCabin}
                returnFlightCabin={returnFlightCabin}
              />
            </Elements>
          ) : (
            <div className='w-full flex justify-center'>
              <Loading />
            </div>
          )}
        </section>
        <section className='w-1/3'>
          <FlightSummaryCard noButton />
          {/* <div className='w-full flex flex-col items-end mt-9'>
            <div className='w-1/3'>
              <Button
                text='Confirm and reserve'
                disabled={
                  chosenDepartureSeats.length < departureFlightPassengers ||
                  chosenReturnSeats.length < returnFlightPassengers
                }
                isLoading={isLoading}
                loadingText='Loading...'
                onClick={handleReserve}
              />
            </div>
            {(chosenDepartureSeats.length < departureFlightPassengers ||
              chosenReturnSeats.length < returnFlightPassengers ||
              error) && (
              <p className='text-input-error'>
                {error?.response?.data.message || 'Please make sure to select all seats'}
              </p>
            )}
          </div> */}
        </section>
      </div>
    </main>
  );
};

export default CheckoutPage;
