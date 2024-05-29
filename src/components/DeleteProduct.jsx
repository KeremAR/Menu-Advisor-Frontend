import React from 'react';
import { MdDelete } from "react-icons/md";
import { useRouter } from 'next/navigation';

function DeleteProduct({ productId, placeId }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const response = await fetch(`https://menuadv.azurewebsites.net/api/v1/Product/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      alert('Product deleted successfully');

      // Navigate to the store's page
      router.push(`/store/${placeId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  return (
    <div onClick={handleDelete} className="cursor-pointer">
      <MdDelete className='text-red-600 text-lg xl:text-3xl' />
    </div>
  );
}

export default DeleteProduct;
