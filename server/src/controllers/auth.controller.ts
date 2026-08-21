import {request, response} from 'express';
import {registerUser} from '../services/auth.services';

export async function register (req: typeof request, res: typeof response) {
    try{
        const {email, password, name} = req.body;

        if (!email || !password || !name)  {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await registerUser(email, password, name);
        res.status(201).json(user);
    } catch (error) {
      if (error.code === '23505') { // Unique violation error code for PostgreSQL
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Error registering user' });
    }
}
