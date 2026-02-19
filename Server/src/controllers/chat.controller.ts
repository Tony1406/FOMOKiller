import { Message } from '../models/MessageModel.js';
import type { Request, Response } from 'express';

export const getContacts = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const askAI = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};