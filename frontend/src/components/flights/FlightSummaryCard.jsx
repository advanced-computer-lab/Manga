import FlightSummary from './FlightSummary';
import FlightPriceCard from './FlightPriceCard';
import { useHttpClient } from '../../hooks/http-hook';
import { useEffect, useState } from 'react';
import { Button } from '../shared/UIKit/Buttons';
import NoSelection from '../../assets/images/no-selection.png';
import { useReservation } from '../context/ReservationContext';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';

const FlightSummaryCard = ({
  noButton,
  flight,
  flightCabin,
  updating,
  oldPrice,
  numberOfPassengers,
}) => {
  const { sendRequest } = useHttpClient();
  const [departureFlight, setDepartureFlight] = useState();
  const [returnFlight, setReturnFlight] = useState();
  const {
    departureFlight: departureFlightId,
    returnFlight: returnFlightId,
    departureFlightCabin,
    returnFlightCabin,
    departureFlightPassengers,
    returnFlightPassengers,
  } = useReservation();
  const { account, openLoginModal } = useAuth();
  const history = useHistory();

  useEffect(() => {
    const getDepartureFlightData = async () => {
      try {
        const response = await sendRequest(`/flight/${departureFlightId}`);
        if (response && response.data) {
          setDepartureFlight(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    const getReturnFlightData = async () => {
      try {
        const response = await sendRequest(`/flight/${returnFlightId}`);
        if (response && response.data) {
          setReturnFlight(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (departureFlightId) {
      getDepartureFlightData();
    } else {
      setDepartureFlight(undefined);
    }
    if (returnFlightId) {
      getReturnFlightData();
    } else {
      setReturnFlight(undefined);
    }
  }, [departureFlightId, returnFlightId, sendRequest]);

  if (updating) {
    return (
      <div className='w-full pl-10'>
        <div className='border-1 border-pale-purple p-6 rounded-xl mb-4'>
          <FlightSummary
            departureTerminal={flight?.departureTerminal}
            arrivalTerminal={flight?.arrivalTerminal}
            flightNumber={flight?.flightNumber}
            departureTime={flight?.departureTime}
            arrivalTime={flight?.arrivalTime}
            cabinClass={flightCabin}
          />
        </div>
        <FlightPriceCard
          flightPrice={flight?.ticketPrice}
          oldPrice={oldPrice}
          numberOfPassengers={numberOfPassengers}
        />
      </div>
    );
  }

  return (
    <div className='w-full pl-10'>
      {!departureFlight && !returnFlight ? (
        <div className='w-full flex items-center flex-col opacity-50'>
          <img
            src={NoSelection}
            alt='choose your departure and return flights'
            width='50%'
            height='50%'
          />
          <p>Select a flight and start your journey!</p>
        </div>
      ) : (
        <>
          <div className='border-1 border-pale-purple p-6 rounded-xl mb-4'>
            {departureFlight && (
              <FlightSummary
                departureTerminal={departureFlight.departureTerminal}
                arrivalTerminal={departureFlight.arrivalTerminal}
                flightNumber={departureFlight.flightNumber}
                departureTime={departureFlight.departureTime}
                arrivalTime={departureFlight.arrivalTime}
                cabinClass={departureFlightCabin}
              />
            )}
            {returnFlight && (
              <>
                <hr className='my-4' />
                <FlightSummary
                  departureTerminal={returnFlight.departureTerminal}
                  arrivalTerminal={returnFlight.arrivalTerminal}
                  flightNumber={returnFlight.flightNumber}
                  departureTime={returnFlight.departureTime}
                  arrivalTime={returnFlight.arrivalTime}
                  cabinClass={returnFlightCabin}
                />
              </>
            )}
          </div>
          <FlightPriceCard
            departureFlightPrice={departureFlight?.ticketPrice}
            returnFlightPrice={returnFlight?.ticketPrice}
            departureFlightPassengers={departureFlightPassengers}
            returnFlightPassengers={returnFlightPassengers}
          />
          {departureFlight && returnFlight && !noButton && (
            <div className='w-full flex justify-end mt-9'>
              <div>
                <Button
                  text='Go to checkout'
                  onClick={() => {
                    if (account) {
                      history.push('/checkout');
                    } else {
                      openLoginModal();
                    }
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FlightSummaryCard;
