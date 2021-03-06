const express = require('express');

const {
  create,
  view,
  updateFlight,
  searchFlights,
  deleteFlight,
  userSearchFlights,
  viewFlight,
  getFlightSeatInfo,
  returnFlights,
  getAlternative,
} = require('./flight.controller');
const { isAdmin, verifyToken } = require('../../middleware/authJwt');
const router = express.Router();

router.post('/', [verifyToken, isAdmin], create);
router.get('/', [verifyToken, isAdmin], view);
router.delete('/', [verifyToken, isAdmin], deleteFlight);
router.post('/search', [verifyToken, isAdmin], searchFlights);
router.put('/:id', [verifyToken, isAdmin], updateFlight);
router.get('/:id', viewFlight);
router.post('/user/search', userSearchFlights);
router.post('/seats/:id', getFlightSeatInfo);
router.post('/return/:id', returnFlights);
router.post('/alternative/:id', [verifyToken], getAlternative);

module.exports = router;
