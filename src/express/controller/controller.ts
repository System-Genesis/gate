import { Request, Response } from 'express';
import { applyTransform } from '../../transformService';


class Controller {
    static async something(req: Request, res: Response) {
        const { scopes, persons } = req.body;
        const moddedPersons = persons.map(person => applyTransform(person, scopes, 'entity'));
        // const moddedPerson = applyTransform(person, scopes);
        res.json(moddedPersons);
    }
}

export default Controller;