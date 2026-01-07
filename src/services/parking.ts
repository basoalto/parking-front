import { request } from './config';

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