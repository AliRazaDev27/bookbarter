import axios from 'axios';
export async function createPost(formData: any) {
    try {
        // const result = await fetch('http://localhost:3000/posts',
        //     {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //         body: JSON.stringify(formData),
        //         credentials: 'include',
        //     }
        // )
        // const data = await result.json();
        const response = await axios.post('http://localhost:3000/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const data = await response.data;
        return data;
    }
    catch (error: any) {
        console.error('Error creating post:', error);
        return { status: "555", message: error.message, data: error };
    }
}