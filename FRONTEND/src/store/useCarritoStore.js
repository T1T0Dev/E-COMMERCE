import { create } from "zustand";

const useCarritoStore = create((set) => ({
  items: [],
  agregarAlCarrito: (producto) =>
    set((state) => {
      // Cambia la comparación: ahora es por id Y id_talle
      const existe = state.items.find(
        (item) => item.id === producto.id && item.id_talle === producto.id_talle
      );
      if (existe) {
        if (existe.cantidad < producto.stock) {
          return {
            items: state.items.map((item) =>
              item.id === producto.id && item.id_talle === producto.id_talle
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
  eliminarProducto: (id, id_talle) =>
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.id === id && item.id_talle === id_talle)
      ),
    })),
  cambiarCantidad: (id, id_talle, cantidad) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id && item.id_talle === id_talle
          ? { ...item, cantidad }
          : item
      ),
    })),
}));

export default useCarritoStore;
