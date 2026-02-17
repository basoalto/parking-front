
import { request } from './config';

export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  description: string;
  stocks: any[];
}

export interface Stock {
  id: number;
  product: number;
  parkingLot: number;
  quantity: number;
}

// 1. Crear producto y stock inicial
export async function createProduct(data: {
  name: string;
  barcode: string;
  price: number;
  description: string;
  parkingLotId: number;
  quantity: number;
}) {
  return await request<{ product: Product; stock: Stock }>(
    '/products',
    'POST',
    data
  );
}

// 2. Editar producto
export async function editProduct(id: number, data: Partial<Product>) {
  return await request<Product>(`/products/${id}`, 'PATCH', data);
}

// 3. Eliminar producto
export async function deleteProduct(id: number) {
  return await request<{ affected: number }>(`/products/${id}`, 'DELETE');
}

// 4. Obtener datos de un producto por id
export async function getProductById(id: number) {
  return await request<Product>(`/products/${id}`, 'GET');
}

// 5. Listar productos por estacionamiento
export async function getProductsByParkingLot(parkingLotId: number) {
  return await request<any[]>(`/products?parkingLotId=${parkingLotId}`, 'GET');
}

// 7. Descontar inventario de un producto
export async function decrementProductStock(stockId: number, quantity: number) {
  return await request(`/products/stock/${stockId}/decrement`, 'PATCH', { quantity });
}
// 4. Descontar inventario y registrar venta
export async function sellProduct(productId: number, parkingLotId: number, quantity: number) {
  return await request<{ stock: any; sale: any }>(
    `/products/stock/${productId}/${parkingLotId}/decrement`,
    'PATCH',
    { quantity }
  );
}

// Obtener ventas totales de todos los productos de un estacionamiento en un rango de fechas
export async function getTotalSalesByParkingLot(parkingLotId: number, startDate: string, endDate: string) {
  return await request<any[]>(
    `/products/sales/parkinglot/${parkingLotId}?startDate=${startDate}&endDate=${endDate}`,
    'GET'
  );
}

// Obtener ventas totales de un producto específico en un rango de fechas
export async function getTotalSalesByProduct(productId: number, startDate: string, endDate: string) {
  return await request<any>(
    `/products/sales/product/${productId}?startDate=${startDate}&endDate=${endDate}`,
    'GET'
  );
}