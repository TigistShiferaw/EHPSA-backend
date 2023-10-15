import { Request, Response } from 'express';
import Event from '../events/event.model';

export const createEvent = async (req: Request, res: Response) => {
  try {
   
    const event = new Event(req.body);
    if (!event) {
      return res.status(400).json({ error: 'Bad request' });
    }
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Could not create event ' + error });
  }
};

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch event' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Could not update event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deletedEvent = await Event.findByIdAndRemove(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Could not delete event' });
  }
};
