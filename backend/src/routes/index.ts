import { Router } from 'express';
import attractionsRoutes from './attractions.routes';
import visitorsRoutes from './visitors.routes';
import {
    joinQueue,
    completeReservation,
    getAttractionQueueStatus,
    getTotalReservationsToday,
    getMostPopularAttraction,
    getTopVisitor,
    createReservation,
    getAllReservations
} from '../controllers/reservations.controller';

const router = Router();

router.use('/attractions', attractionsRoutes);
router.use('/visitors', visitorsRoutes);

router.post('/queue/join', joinQueue);
router.post('/reservations', createReservation);
router.get('/reservations', getAllReservations);
router.put('/reservations/:reservationId/complete', completeReservation);
router.get('/attractions/:attractionId/queue-status', getAttractionQueueStatus);

router.get('/analytics/total-reservations-today', getTotalReservationsToday);
router.get('/analytics/most-popular-attraction', getMostPopularAttraction);
router.get('/analytics/top-visitor', getTopVisitor);

export default router;