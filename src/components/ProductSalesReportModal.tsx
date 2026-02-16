import React from "react";


interface ProductSalesReportModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  data: {
    sales?: { totalQuantity: string; totalAmount: string };
    entries?: Array<{
      id: number;
      product: { id: number };
      parkingLot: { id: number };
      quantity: number;
      date: string;
    }>;
    totalEntries?: number;
    totalSold?: number;
  } | null;
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
        {data && data.sales ? (
          <div className="mt-4 text-lg">
            <div>Cantidad vendida: <span className="font-bold">{data.sales.totalQuantity}</span></div>
            <div>Total vendido: <span className="font-bold">${data.sales.totalAmount}</span></div>
            <div className="mt-2 text-sm text-gray-400">Total entradas: <span className="font-bold">{data.totalEntries}</span></div>
            <div className="text-sm text-gray-400">Total vendido (unidades): <span className="font-bold">{data.totalSold}</span></div>
            {data.entries && data.entries.length > 0 && (
              <div className="mt-4">
                <div className="font-bold text-blue-300 mb-2">Entradas de inventario:</div>
                <table className="min-w-full text-xs text-left text-gray-400 mb-2">
                  <thead>
                    <tr>
                      <th className="px-2 py-1">ID</th>
                      <th className="px-2 py-1">Cantidad</th>
                      <th className="px-2 py-1">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.entries.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-2 py-1">{entry.id}</td>
                        <td className="px-2 py-1">{entry.quantity}</td>
                        <td className="px-2 py-1">{new Date(entry.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 text-gray-400">Sin ventas en este rango.</div>
        )}
      </div>
    </div>
  );
}
