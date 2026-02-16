import React from 'react';

interface InventoryTableProps {
  products: Array<{ product: { id: number; name: string; barcode: string; price: number; description: string }; quantity: number }>;
  onEdit: (item: { product: { id: number; name: string; barcode: string; price: number; description: string }; quantity: number }) => void;
  onDelete: (id: number) => void;
  onSell: (item: { product: { id: number; name: string; barcode: string; price: number; description: string }; quantity: number }) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ products, onEdit, onDelete, onSell }) => {
  // Mostrar todos los productos, pero reducir el alto máximo de la tabla
  return (
    <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
      <table className="min-w-full text-xs text-left text-gray-400">
        <thead>
          <tr>
            <th className="px-2 py-1">Nombre</th>
            <th className="px-2 py-1">Código</th>
            <th className="px-2 py-1">Precio</th>
            <th className="px-2 py-1">Descripción</th>
            <th className="px-2 py-1">Cantidad</th>
            <th className="px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-2">
                No hay productos
              </td>
            </tr>
          ) : (
            products.map((item) => (
              <tr key={item.product.id}>
                <td className="px-2 py-1">{item.product.name}</td>
                <td className="px-2 py-1">{item.product.barcode}</td>
                <td className="px-2 py-1">${item.product.price}</td>
                <td className="px-2 py-1">{item.product.description}</td>
                <td className="px-2 py-1">{item.quantity}</td>
                <td className="px-2 py-1 flex space-x-2">
                  <button onClick={() => onEdit(item)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2 2 0 012.828 2.828L11.828 13.828a2 2 0 01-2.828 0L9 11z"></path></svg>
                  </button>
                  <button onClick={() => onDelete(item.product.id)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                  <button onClick={() => onSell(item)}>
                    Vender
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
