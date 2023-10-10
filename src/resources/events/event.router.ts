import express from 'express';
import { respond } from '../../utils/respond';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../events/event.controller';

const eventRouter = express.Router();

eventRouter.post('/addEvents', createEvent,respond);
eventRouter.get('/getEvents', getAllEvents);
eventRouter.get('/getEventsById/:id', getEventById,respond);
eventRouter.put('/editEvents/:id', updateEvent,respond);
eventRouter.delete('/deleteEvents/:id', deleteEvent,respond);

export default eventRouter;
