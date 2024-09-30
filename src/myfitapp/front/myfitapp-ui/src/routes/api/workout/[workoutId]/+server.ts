import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

const API_URL = 'http://localhost:8000';

export const GET: RequestHandler = async ({ params, fetch }) => {
    try {
        const response = await fetch(`${API_URL}/workout/${params.workoutId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch workout details');
        }
        const workout = await response.json();
        return json(workout);
    } catch (error) {
        console.error('Error fetching workout details:', error);
        return json({ error: 'Failed to fetch workout details' }, { status: 500 });
    }
};

export const PATCH: RequestHandler = async ({ params, request, fetch }) => {
    try {
        const updatedScheda = await request.json();
        const response = await fetch(`${API_URL}/workout/${params.workoutId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedScheda),
        });
        if (!response.ok) {
            throw new Error('Failed to update workout');
        }
        return json({ message: 'Workout updated successfully' });
    } catch (error) {
        console.error('Error updating workout:', error);
        return json({ error: 'Failed to update workout' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params, fetch }) => {
    try {
        const response = await fetch(`${API_URL}/workout/${params.workoutId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete workout');
        }

        return json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Error deleting workout:', error);
        return json({ error: 'Failed to delete workout' }, { status: 500 });
    }
};
