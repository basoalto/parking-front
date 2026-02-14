import { useEffect, useState } from 'react';
import {
  getProductsByParkingLot,
  createProduct,
  editProduct,
  deleteProduct,
  sellProduct
} from '../services/inventory';
import { X, Pencil, Trash2, Plus } from 'lucide-react';

interface InventoryModalProps {
  parkingLotId: number;
  open: boolean;
  onClose: () => void;
}

export function InventoryModal({
  parkingLotId,
  open,
  onClose
}: InventoryModalProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProductData, setEditProductData] = useState<any | null>(null);
  const [showInvalidQuantity, setShowInvalidQuantity] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellTotal, setSellTotal] = useState(0);
  const [showSaleSuccess, setShowSaleSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const data = await getProductsByParkingLot(parkingLotId);
      setProducts(data || []);
    } catch {
      alert('Error al cargar productos');
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    try {
      await createProduct({
        parkingLotId,
        name: form.get('name'),
        barcode: form.get('barcode'),
        price: Number(form.get('price')),
        description: form.get('description'),
        quantity: Number(form.get('quantity'))
      });

      setShowAddForm(false);
      fetchProducts();
    } catch {
      alert('Error al crear producto');
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProductData) return;

    const form = new FormData(e.currentTarget);

    try {
      await editProduct(editProductData.product.id, {
        name: form.get('name'),
        price: Number(form.get('price')),
        description: form.get('description')
      });

      setEditProductData(null);
      fetchProducts();
    } catch {
      alert('Error al editar producto');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch {
      alert('Error al eliminar producto');
    }
  };

  const handleSell = async () => {
    if (!selectedProduct) return;

    if (
      sellQuantity < 1 ||
      sellQuantity > selectedProduct.quantity
    ) {
      setShowInvalidQuantity(true);
      return;
    }

    try {
      const res = await sellProduct(
        selectedProduct.id,
        sellQuantity
      );

      if (res?.sale?.id) {
        setShowSaleSuccess(true);
        setSelectedProduct(null);
        setSellQuantity(1);
        setSellTotal(0);
        fetchProducts();
      } else {
        alert('Error al vender producto');
      }
    } catch {
      alert('Error al vender producto');
    }
  };

  return (
    <>
      {/* MODAL PRINCIPAL */}
      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border-2 border-orange-500/30 rounded-lg p-8 max-w-2xl w-full relative">

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-orange-400"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-orange-400 mb-6">
              Inventario de Productos
            </h2>

            <button
              onClick={() => setShowAddForm(true)}
              className="mb-4 flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Producto</span>
            </button>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedProduct(null);
              }}
              placeholder="Buscar producto..."
              className="mb-4 w-full p-2 rounded bg-zinc-800 text-white"
            />

            {/* Venta */}
            {selectedProduct && (
              <div className="mb-4 p-4 bg-zinc-800 rounded">
                <div className="mb-2 font-bold text-orange-400">
                  {selectedProduct.product.name}
                </div>

                <div className="mb-2 text-gray-300">
                  Precio: ${selectedProduct.product.price}
                </div>

                <div className="mb-2 text-gray-300">
                  Cantidad disponible: {selectedProduct.quantity}
                </div>

                <input
                  type="number"
                  min={1}
                  max={selectedProduct.quantity}
                  value={sellQuantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSellQuantity(val);
                    setSellTotal(val * selectedProduct.product.price);
                  }}
                  className="w-full p-2 rounded bg-zinc-900 text-white mb-2"
                />

                <div className="mb-2 text-yellow-400 font-bold">
                  Total: ${sellTotal}
                </div>

                <button
                  onClick={handleSell}
                  className="w-full py-2 bg-orange-600 text-white rounded-lg"
                >
                  Vender
                </button>
              </div>
            )}

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-400">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Código</th>
                    <th className="px-4 py-2">Precio</th>
                    <th className="px-4 py-2">Descripción</th>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No hay productos
                      </td>
                    </tr>
                  ) : (
                    products
                      .filter((item: any) => {
                        const values = [
                          item.product.name,
                          item.product.barcode,
                          item.product.price,
                          item.product.description,
                          item.quantity
                        ];
                        return values.some((v) =>
                          v
                            ?.toString()
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        );
                      })
                      .map((item: any) => (
                        <tr key={item.product.id}>
                          <td className="px-4 py-2">{item.product.name}</td>
                          <td className="px-4 py-2">{item.product.barcode}</td>
                          <td className="px-4 py-2">${item.product.price}</td>
                          <td className="px-4 py-2">{item.product.description}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2 flex space-x-2">
                            <button onClick={() => setEditProductData(item)}>
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteProduct(item.product.id)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedProduct(item);
                                setSellQuantity(1);
                                setSellTotal(item.product.price);
                              }}
                            >
                              Vender
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Popup Agregar */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-zinc-900 p-8 rounded-lg w-full max-w-md relative">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-orange-400"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <input name="name" required className="w-full p-2 rounded bg-zinc-800 text-white" placeholder="Nombre" />
                    <input name="barcode" className="w-full p-2 rounded bg-zinc-800 text-white" placeholder="Código" />
                    <input name="price" type="number" required className="w-full p-2 rounded bg-zinc-800 text-white" placeholder="Precio" />
                    <input name="description" className="w-full p-2 rounded bg-zinc-800 text-white" placeholder="Descripción" />
                    <input name="quantity" type="number" required className="w-full p-2 rounded bg-zinc-800 text-white" placeholder="Cantidad" />
                    <button type="submit" className="w-full py-2 bg-orange-600 text-white rounded-lg">
                      Agregar
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* POPUP CANTIDAD INVÁLIDA */}
      {showInvalidQuantity && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
          <div className="bg-zinc-900 border-2 border-red-500/30 rounded-lg p-8 max-w-md w-full relative text-center">
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              Cantidad inválida
            </h3>
            <button
              onClick={() => setShowInvalidQuantity(false)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* POPUP VENTA EXITOSA */}
      {showSaleSuccess && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
          <div className="bg-zinc-900 border-2 border-green-500/30 rounded-lg p-8 max-w-md w-full relative text-center">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Venta realizada
            </h3>
            <button
              onClick={() => setShowSaleSuccess(false)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

{/* POPUP EDITAR PRODUCTO */}
{editProductData && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
    <div className="bg-zinc-900 border-2 border-blue-500/30 rounded-lg p-8 max-w-md w-full relative">

      <button
        onClick={() => setEditProductData(null)}
        className="absolute top-4 right-4 text-gray-400 hover:text-blue-400"
      >
        <X className="w-6 h-6" />
      </button>

      <h3 className="text-2xl font-bold text-blue-400 mb-4">
        Editar Producto
      </h3>

      <form onSubmit={handleEditProduct} className="space-y-4">
        <input
          name="name"
          defaultValue={editProductData.product.name}
          required
          className="w-full p-2 rounded bg-zinc-800 text-white"
          placeholder="Nombre"
        />

        <input
          name="price"
          type="number"
          defaultValue={editProductData.product.price}
          required
          className="w-full p-2 rounded bg-zinc-800 text-white"
          placeholder="Precio"
        />

        <input
          name="description"
          defaultValue={editProductData.product.description}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          placeholder="Descripción"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  </div>
)}


    </>
  );
}
