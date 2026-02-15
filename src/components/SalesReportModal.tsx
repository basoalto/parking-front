import React, { useState } from "react";

interface SalesReportModalProps {
  open: boolean;
  onClose: () => void;
  data: any[];
  startDate: string;
  endDate: string;
}

export function SalesReportModal({ open, onClose, data, startDate, endDate }: SalesReportModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-zinc-900 border-2 border-orange-500/30 rounded-lg p-8 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-orange-400"
        >
          Cerrar
        </button>
        <h3 className="text-2xl font-bold text-orange-400 mb-4">Informe de Ventas</h3>
        <div className="mb-2 text-gray-300">Rango: {startDate} a {endDate}</div>
        <table className="min-w-full text-sm text-left text-gray-400 mb-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4">Sin ventas</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.productId}>
                  <td className="px-4 py-2">{item.productName}</td>
                  <td className="px-4 py-2">{item.totalQuantity}</td>
                  <td className="px-4 py-2">${item.totalAmount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
