const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/en/api';

export class ProductsService {
  static async getPurchasedProducts(token: string, page: number = 0) {
    const response = await fetch(`${BACKEND_URL}/courses/products/?limit=100&offset=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }
}
