import axios from 'axios';
export async function createPost(formData: any) {
    try {
        const response = await axios.post('http://localhost:3000/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
        const data = await response.data;
        return {status: response.status, ...data};
    }
    catch (error: any) {
        console.error('Error creating post:', error);
        return { status: error.response.status || 555, message: error.message, data: error.response.data.data };
    }
}