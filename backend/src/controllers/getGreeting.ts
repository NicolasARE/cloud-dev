import { Request, Response } from 'express';

const GREETING = 'Hello world';

const getGreeting = async (req: Request, res: Response): Promise<void> => {
    res.send({
        greeting: GREETING,
    });
};

export default getGreeting;
