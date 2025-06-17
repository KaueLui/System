import { Router } from 'express';
import {
    createAttraction,
    getAttractions,
    getAttractionById,
    updateAttraction,
    deleteAttraction
} from '../controllers/attractions.controller';

const router = Router();

router.post('/', createAttraction);         
router.get('/', getAttractions);            
router.get('/:id', getAttractionById);      
router.put('/:id', updateAttraction);       
router.delete('/:id', deleteAttraction);    

export default router;