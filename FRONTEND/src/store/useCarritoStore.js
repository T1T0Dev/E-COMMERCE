import { create } from 'zustand';

const useCarritoStore = create((set) => ({
  items: [],
  agregarAlCarrito: (producto) =>
    set((state) => {
      const existe = state.items.find((item) => item.id === producto.id);
      if (existe) {
        if (existe.cantidad < producto.stock) {
          return {
            items: state.items.map((item) =>
              item.id === producto.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            ),
          };
        }
        return state;
      }
      return { items: [...state.items, { ...producto, cantidad: 1 }] };
    }),
  // Puedes agregar métodos para quitar, vaciar, etc.
}));

export default useCarritoStore;