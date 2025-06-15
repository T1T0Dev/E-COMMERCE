import { create } from "zustand";

const useCarritoStore = create((set) => ({
  items: [],
  agregarAlCarrito: (producto) =>
    set((state) => {
      // Comparar por id_producto y id_talle
      const existe = state.items.find(
        (item) => item.id_producto === producto.id_producto && item.id_talle === producto.id_talle
      );
      if (existe) {
        if (existe.cantidad < producto.stock) {
          return {
            items: state.items.map((item) =>
              item.id_producto === producto.id_producto && item.id_talle === producto.id_talle
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            ),
          };
        }
        return state;
      }
      return { items: [...state.items, { ...producto, cantidad: 1 }] };
    }),

  limpiarCarrito: () => set({ items: [] }),
  eliminarProducto: (id_producto, id_talle) =>
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.id_producto === id_producto && item.id_talle === id_talle)
      ),
    })),
  cambiarCantidad: (id_producto, id_talle, cantidad) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id_producto === id_producto && item.id_talle === id_talle
          ? { ...item, cantidad }
          : item
      ),
    })),
}));

export default useCarritoStore;