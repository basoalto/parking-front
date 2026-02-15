import React from "react";

interface ProductSalesReportModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  data: { totalQuantity: string; totalAmount: string } | null;
  startDate: string;
  endDate: string;
}

export function ProductSalesReportModal({ open, onClose, productName, data, startDate, endDate }: ProductSalesReportModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-zinc-900 border-2 border-blue-500/30 rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-400"
        >
          Cerrar
        </button>
        <h3 className="text-2xl font-bold text-blue-400 mb-4">Informe de Ventas por Producto</h3>
        <div className="mb-2 text-gray-300">Producto: <span className="font-bold">{productName}</span></div>
        <div className="mb-2 text-gray-300">Rango: {startDate} a {endDate}</div>
        {data ? (
          <div className="mt-4 text-lg">
            <div>Cantidad vendida: <span className="font-bold">{data.totalQuantity}</span></div>
            <div>Total vendido: <span className="font-bold">${data.totalAmount}</span></div>
          </div>
        ) : (
          <div className="mt-4 text-gray-400">Sin ventas en este rango.</div>
        )}
      </div>
    </div>
  );
}
