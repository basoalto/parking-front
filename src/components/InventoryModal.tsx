import { useEffect, useState } from "react";
import {
  getProductsByParkingLot,
  createProduct,
  editProduct,
  deleteProduct,
  sellProduct,
  getTotalSalesByParkingLot,
  getTotalSalesByProduct,
  Product,
} from "../services/inventory";
import { X, Pencil, Trash2, Plus, BarChart2 } from "lucide-react";
import { SalesReportModal } from "./SalesReportModal";
import { ProductSalesReportModal } from "./ProductSalesReportModal";
import InventoryTable from "./InventoryTable";

interface InventoryModalProps {
  parkingLotId: number;
  open: boolean;
  onClose: () => void;
}

export function InventoryModal({
  parkingLotId,
  open,
  onClose,
}: InventoryModalProps) {
  const [products, setProducts] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProductData, setEditProductData] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);
  const [showInvalidQuantity, setShowInvalidQuantity] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);
  const [sellQuantity, setSellQuantity] = useState<number | "">("");
  const [sellTotal, setSellTotal] = useState(0);
  const [showSaleSuccess, setShowSaleSuccess] = useState(false);

  // Reporte de ventas
  const [showSalesReport, setShowSalesReport] = useState(false);
  const [salesReportData, setSalesReportData] = useState<
    {
      productId: number;
      productName: string;
      totalQuantity: string;
      totalAmount: string;
    }[]
  >([]);
  const [showSalesReportModal, setShowSalesReportModal] = useState(false);
  const [salesReportStart, setSalesReportStart] = useState("");
  const [salesReportEnd, setSalesReportEnd] = useState("");
  const [loadingSalesReport, setLoadingSalesReport] = useState(false);

  // Reporte por producto
  const [productReportData, setProductReportData] = useState<{
    totalQuantity: string;
    totalAmount: string;
  } | null>(null);
  const [productReportStart, setProductReportStart] = useState("");
  const [productReportEnd, setProductReportEnd] = useState("");
  const [selectedReportProduct, setSelectedReportProduct] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);
  const [loadingProductReport, setLoadingProductReport] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchProducts = async () => {
    try {
      const data = await getProductsByParkingLot(parkingLotId);
      setProducts(data || []);
    } catch {
      alert("Error al cargar productos");
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    try {
      await createProduct({
        parkingLotId,
        name: String(form.get("name") || ""),
        barcode: String(form.get("barcode") || ""),
        price: Number(form.get("price")),
        description: String(form.get("description") || ""),
        quantity: Number(form.get("quantity")),
      });

      setShowAddForm(false);
      fetchProducts();
    } catch {
      alert("Error al crear producto");
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProductData) return;

    const form = new FormData(e.currentTarget);

    try {
      const data: Partial<Product> & {
        parkingLotId: number;
        quantity?: number;
      } = {
        name: String(form.get("name") || ""),
        price: Number(form.get("price")),
        description: String(form.get("description") || ""),
        parkingLotId,
      };
      const newQuantity = Number(form.get("quantity"));
      if (
        !isNaN(newQuantity) &&
        typeof editProductData.quantity !== "undefined" &&
        newQuantity !== editProductData.quantity
      ) {
        data.quantity = newQuantity;
      }
      await editProduct(editProductData.product.id, data);
      setEditProductData(null);
      fetchProducts();
    } catch {
      alert("Error al editar producto");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch {
      alert("Error al eliminar producto");
    }
  };

  const handleSell = async () => {
    if (!selectedProduct) return;

    if (
      typeof sellQuantity !== "number" ||
      sellQuantity < 1 ||
      sellQuantity > selectedProduct.quantity
    ) {
      setShowInvalidQuantity(true);
      return;
    }

    try {
      const res = await sellProduct(selectedProduct.product.id, sellQuantity);

      if (res?.sale?.id) {
        setShowSaleSuccess(true);
        setSelectedProduct(null);
        setSellQuantity(1);
        setSellTotal(0);
        fetchProducts();
      } else {
        alert("Error al vender producto");
      }
    } catch {
      alert("Error al vender producto");
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

            <div className="flex mb-4 gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Producto</span>
              </button>
              <button
                onClick={() => setShowSalesReport(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg ml-auto"
              >
                <BarChart2 className="w-4 h-4" />
                <span>Ver Informe</span>
              </button>
            </div>
            {/* MODAL INFORME DE VENTAS GENERAL */}
            {showSalesReport && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
                <div className="bg-zinc-900 border-2 border-orange-500/30 rounded-lg p-8 max-w-lg w-full relative">
                  <button
                    onClick={() => setShowSalesReport(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-orange-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <h3 className="text-2xl font-bold text-orange-400 mb-4">
                    Informe de Ventas
                  </h3>
                  <form
                    className="mb-4 flex flex-col gap-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setLoadingSalesReport(true);
                      try {
                        const data = await getTotalSalesByParkingLot(
                          parkingLotId,
                          salesReportStart,
                          salesReportEnd,
                        );
                        setSalesReportData(data || []);
                        setShowSalesReportModal(true);
                      } catch {
                        setSalesReportData([]);
                        alert("Error al obtener informe");
                      }
                      setLoadingSalesReport(false);
                    }}
                  >
                    <label className="text-sm text-gray-300">
                      Rango de fechas
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={salesReportStart}
                        onChange={(e) => setSalesReportStart(e.target.value)}
                        className="p-2 rounded bg-zinc-800 text-white"
                        required
                      />
                      <input
                        type="date"
                        value={salesReportEnd}
                        onChange={(e) => setSalesReportEnd(e.target.value)}
                        className="p-2 rounded bg-zinc-800 text-white"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg"
                        disabled={loadingSalesReport}
                      >
                        {loadingSalesReport ? "Cargando..." : "Ver informe"}
                      </button>
                    </div>
                  </form>
                  <SalesReportModal
                    open={showSalesReportModal}
                    onClose={() => {
                      setShowSalesReportModal(false);
                      setSalesReportData([]);
                    }}
                    data={salesReportData}
                    startDate={salesReportStart}
                    endDate={salesReportEnd}
                  />
                  <hr className="my-4 border-zinc-700" />
                  <h4 className="text-lg font-bold text-blue-400 mb-2">
                    Informe por Producto
                  </h4>
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!selectedReportProduct) return;
                      setLoadingProductReport(true);
                      try {
                        const data = await getTotalSalesByProduct(
                          selectedReportProduct.product.id,
                          productReportStart,
                          productReportEnd,
                        );
                        setProductReportData(data);
                      } catch {
                        setProductReportData(null);
                        alert("Error al obtener informe por producto");
                      }
                      setLoadingProductReport(false);
                    }}
                  >
                    <label className="text-sm text-gray-300">
                      Rango de fechas
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={productReportStart}
                        onChange={(e) => setProductReportStart(e.target.value)}
                        className="p-2 rounded bg-zinc-800 text-white"
                        required
                      />
                      <input
                        type="date"
                        value={productReportEnd}
                        onChange={(e) => setProductReportEnd(e.target.value)}
                        className="p-2 rounded bg-zinc-800 text-white"
                        required
                      />
                    </div>
                    <label className="text-sm text-gray-300 mt-2">
                      Producto
                    </label>
                    <select
                      value={selectedReportProduct?.product.id || ""}
                      onChange={(e) => {
                        const prod = products.find(
                          (p) => p.product.id === Number(e.target.value),
                        );
                        setSelectedReportProduct(prod || null);
                      }}
                      className="p-2 rounded bg-zinc-800 text-white"
                      required
                    >
                      <option value="">Seleccionar producto</option>
                      {products.map((item) => (
                        <option key={item.product.id} value={item.product.id}>
                          {item.product.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-2"
                      disabled={loadingProductReport}
                    >
                      {loadingProductReport
                        ? "Cargando..."
                        : "Ver informe por producto"}
                    </button>
                  </form>
                  <ProductSalesReportModal
                    open={!!productReportData}
                    onClose={() => setProductReportData(null)}
                    productName={selectedReportProduct?.product.name || ""}
                    data={productReportData}
                    startDate={productReportStart}
                    endDate={productReportEnd}
                  />
                </div>
              </div>
            )}

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
                    const val = e.target.value;

                    if (val === "") {
                      setSellQuantity("");
                      setSellTotal(0);
                      return;
                    }

                    const num = Number(val);
                    setSellQuantity(num);
                    setSellTotal(num * selectedProduct.product.price);
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

            {/* Tabla de inventario con scroll y máximo 10 productos */}
            <InventoryTable
              products={products
                .filter((item) => {
                  const values = [
                    item.product.name,
                    item.product.barcode,
                    item.product.price,
                    item.product.description,
                    item.quantity,
                  ];
                  return values.some((v) =>
                    v?.toString().toLowerCase().includes(search.toLowerCase())
                  );
                })}
              onEdit={(item) => setEditProductData(item)}
              onDelete={(id) => handleDeleteProduct(id)}
              onSell={(item) => {
                setSelectedProduct(item);
                setSellQuantity(1);
                setSellTotal(item.product.price);
              }}
            />

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
                    <input
                      name="name"
                      required
                      className="w-full p-2 rounded bg-zinc-800 text-white"
                      placeholder="Nombre"
                    />
                    <input
                      name="barcode"
                      className="w-full p-2 rounded bg-zinc-800 text-white"
                      placeholder="Código"
                    />
                    <input
                      name="price"
                      type="number"
                      required
                      className="w-full p-2 rounded bg-zinc-800 text-white"
                      placeholder="Precio"
                    />
                    <input
                      name="description"
                      className="w-full p-2 rounded bg-zinc-800 text-white"
                      placeholder="Descripción"
                    />
                    <input
                      name="quantity"
                      type="number"
                      required
                      className="w-full p-2 rounded bg-zinc-800 text-white"
                      placeholder="Cantidad"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-orange-600 text-white rounded-lg"
                    >
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
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-1">
                  Nombre
                </label>
                <input
                  name="name"
                  defaultValue={editProductData.product.name}
                  required
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-1">
                  Precio
                </label>
                <input
                  name="price"
                  type="number"
                  defaultValue={editProductData.product.price}
                  required
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  placeholder="Precio"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-1">
                  Descripción
                </label>
                <input
                  name="description"
                  defaultValue={editProductData.product.description}
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  placeholder="Descripción"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-1">
                  Cantidad
                </label>
                <input
                  name="quantity"
                  type="number"
                  defaultValue={editProductData.quantity}
                  required
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  placeholder="Cantidad"
                />
              </div>
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
