import React from 'react';
import { MdDelete } from "react-icons/md";
import { useRouter } from 'next/navigation';

function DeleteReview({ reviewId, productId }) {
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (!confirmed) return;

        try {
            const response = await fetch(`https://menuadv.azurewebsites.net/api/v1/Review/${reviewId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            alert('Review deleted successfully');

            // Reload the product page to refresh the reviews
            router.refresh();
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Error deleting review');
        }
    };

    return (
        <div onClick={handleDelete} className="cursor-pointer">
            <MdDelete className='text-red-600 text-lg xl:text-3xl' />
        </div>
    );
}

export default DeleteReview;
