import { Router } from 'express';
import {
    createVisitor,
    getVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor
} from '../controllers/visitors.controller';
import {
    getVisitorQueues,
    getVisitorReservations,
    getVisitorAttractionHistory
} from '../controllers/reservations.controller';

const router = Router();

router.post('/', createVisitor);           
router.get('/', getVisitors);               
router.get('/:id', getVisitorById);         
router.put('/:id', updateVisitor);          
router.delete('/:id', deleteVisitor);       

router.get('/:visitorId/queues', getVisitorQueues);        
router.get('/:visitorId/reservations', getVisitorReservations);
router.get('/:visitorId/attraction-history', getVisitorAttractionHistory);

export default router;