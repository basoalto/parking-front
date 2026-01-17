
import { request } from './config';
export interface CarData {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  puntaje: number;
}


export interface ParkingLot {
  id?: number;
  nombre: string;
  direccion: string;
  tarifaPorHora: number;
}

export interface Assignment {
  id: number;
  carId: number;
  parkingLotId: number;
  fechaEntrada: string;
  tarifa: number;
}

export interface ActiveAssignment {
  id: number;
  carId: number;
  parkingLotId: number;
  fechaEntrada: string;
  tarifa: number;
  fechaSalida: string | null;
  total: number | null;
  placa: string;
}

export async function createParkingLot(data: Omit<ParkingLot, 'id'>): Promise<ParkingLot> {
  return await request<ParkingLot>('/parkinglot', 'POST', data);
}

export async function getParkingLots(): Promise<ParkingLot[]> {
  return await request<ParkingLot[]>('/parkinglot', 'GET');
}

export async function assignCarToParkingLot(placa: string, parkingLotId: number): Promise<Assignment> {
  return await request<Assignment>('/assignment/by-plate', 'POST', { placa, parkingLotId });
}

export async function getActiveAssignments(parkingLotId: number): Promise<ActiveAssignment[]> {
  return await request<ActiveAssignment[]>(`/assignment/active/${parkingLotId}`, 'GET');
}

export async function getFinishedAssignments(parkingLotId: number): Promise<ActiveAssignment[]> {
  return await request<ActiveAssignment[]>(`/assignment/finished/${parkingLotId}`, 'GET');
}

export async function checkoutAssignment(assignmentId: number, fechaSalida: string): Promise<ActiveAssignment> {
  return await request<ActiveAssignment>(`/assignment/${assignmentId}`, 'PATCH', { fechaSalida });
}

export async function updateParkingLot(id: number, data: Partial<ParkingLot & { tarifaMinima?: number }>): Promise<{ affected: number }> {
  return await request<{ affected: number }>(`/parkinglot/${id}`, 'PATCH', data);
}

export async function updateCar(carId: number, data: { placa: string; marca?: string; modelo?: string; color?: string }): Promise<{ affected: number }> {
  return await request<{ affected: number }>(`/car/${carId}`, 'PATCH', data);
}

export async function getCarByPlate(plate: string): Promise<CarData | null> {
  return await request<CarData | null>(`/car/plate/${plate}`, 'GET');
}

export async function redeemPrizeByPlate(plate: string, prizeId: number): Promise<CarData> {
  return await request<CarData>(`/car/redeem/${plate}/${prizeId}`, 'POST');
}

// Asignar persona a un auto
export async function assignPersonToCar(carId: number, rut: string): Promise<{ success: boolean }> {
  return await request<{ success: boolean }>('/car/assign-person', 'POST', { carId, rut });
}