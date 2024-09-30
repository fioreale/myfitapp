import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

const API_URL = 'http://localhost:8000';

export const GET: RequestHandler = async ({ fetch }) => {
    try {
        const response = await fetch(`${API_URL}/workout`);
        if (!response.ok) {
            throw new Error(`Failed to fetch workouts: ${response.status} ${response.statusText}`);
        }
        const workouts = await response.json();
        console.log('Loaded Workouts:', workouts); // Log the actual workouts data
        return json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return json({ error: 'Failed to fetch workouts' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const workout = await request.json();
        const response = await fetch(`${API_URL}/workout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workout),
        });
        if (!response.ok) {
            throw new Error('Failed to create workout');
        }
        return json({ message: 'Workout created successfully' });
    } catch (error) {
        console.error('Error creating workout:', error);
        return json({ error: 'Failed to create workout' }, { status: 500 });
    }
};
