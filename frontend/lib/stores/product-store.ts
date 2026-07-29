/**
 * Product store — manages Compare Products tray, Recently Viewed products,
 * Quote Cart, and Wishlist. Persisted to localStorage so state survives reloads.
 */
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type StoredProduct = {
  slug: string;
  name: string;
  category: string;
  image: string;
  shortDescription: string;
  minOrder?: string;
  leadTime?: string;
  rating?: number;
  reviewCount?: number;
};

export type CartItem = StoredProduct & {
  quantity: number;
};

type ProductStoreState = {
  /** Products selected for side-by-side comparison (max 3) */
  compare: StoredProduct[];
  /** Recently viewed products (max 6, most recent first) */
  recentlyViewed: StoredProduct[];
  /** Compare drawer open/closed */
  compareOpen: boolean;
  /** Products in the quote cart */
  cart: CartItem[];
  /** Cart drawer open/closed */
  cartOpen: boolean;
  /** Products saved to wishlist (max 12) */
  wishlist: StoredProduct[];

  addToCompare: (product: StoredProduct) => void;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  toggleCompare: (product: StoredProduct) => void;
  isInCompare: (slug: string) => boolean;
  setCompareOpen: (open: boolean) => void;

  addRecentlyViewed: (product: StoredProduct) => void;
  clearRecentlyViewed: () => void;

  addToCart: (product: StoredProduct, quantity?: number) => void;
  removeFromCart: (slug: string) => void;
  updateCartQuantity: (slug: string, quantity: number) => void;
  incrementCart: (slug: string) => void;
  decrementCart: (slug: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  cartTotalItems: () => number;

  toggleWishlist: (product: StoredProduct) => void;
  removeFromWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
  clearWishlist: () => void;
};

const MAX_COMPARE = 3;
const MAX_RECENT = 6;
const MAX_WISHLIST = 12;

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      compare: [],
      recentlyViewed: [],
      compareOpen: false,
      cart: [],
      cartOpen: false,
      wishlist: [],

      addToCompare: (product) => {
        const { compare } = get();
        if (compare.some((p) => p.slug === product.slug)) return;
        if (compare.length >= MAX_COMPARE) {
          // Replace oldest entry
          set({ compare: [...compare.slice(1), product] });
        } else {
          set({ compare: [...compare, product] });
        }
      },

      removeFromCompare: (slug) =>
        set((s) => ({ compare: s.compare.filter((p) => p.slug !== slug) })),

      clearCompare: () => set({ compare: [] }),

      toggleCompare: (product) => {
        const { compare } = get();
        if (compare.some((p) => p.slug === product.slug)) {
          set({ compare: compare.filter((p) => p.slug !== product.slug) });
        } else if (compare.length < MAX_COMPARE) {
          set({ compare: [...compare, product] });
        }
      },

      isInCompare: (slug) => get().compare.some((p) => p.slug === slug),

      setCompareOpen: (open) => set({ compareOpen: open }),

      addRecentlyViewed: (product) => {
        const { recentlyViewed } = get();
        // Move to top if already exists, otherwise prepend
        const filtered = recentlyViewed.filter((p) => p.slug !== product.slug);
        set({ recentlyViewed: [product, ...filtered].slice(0, MAX_RECENT) });
      },

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existing = cart.find((i) => i.slug === product.slug);
        if (existing) {
          set({
            cart: cart.map((i) =>
              i.slug === product.slug
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity }] });
        }
      },

      removeFromCart: (slug) =>
        set((s) => ({ cart: s.cart.filter((i) => i.slug !== slug) })),

      updateCartQuantity: (slug, quantity) =>
        set((s) => ({
          cart: s.cart
            .map((i) =>
              i.slug === slug ? { ...i, quantity: Math.max(1, quantity) } : i,
            )
            // Drop items reduced to 0 (safety)
            .filter((i) => i.quantity > 0),
        })),

      incrementCart: (slug) =>
        set((s) => ({
          cart: s.cart.map((i) =>
            i.slug === slug ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),

      decrementCart: (slug) =>
        set((s) => ({
          cart: s.cart
            .map((i) =>
              i.slug === slug
                ? { ...i, quantity: Math.max(0, i.quantity - 1) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ cart: [] }),
      setCartOpen: (open) => set({ cartOpen: open }),
      cartTotalItems: () =>
        get().cart.reduce((sum, i) => sum + i.quantity, 0),

      toggleWishlist: (product) => {
        const { wishlist } = get();
        if (wishlist.some((p) => p.slug === product.slug)) {
          set({ wishlist: wishlist.filter((p) => p.slug !== product.slug) });
        } else if (wishlist.length < MAX_WISHLIST) {
          set({ wishlist: [...wishlist, product] });
        } else {
          // Replace oldest
          set({ wishlist: [...wishlist.slice(1), product] });
        }
      },

      removeFromWishlist: (slug) =>
        set((s) => ({ wishlist: s.wishlist.filter((p) => p.slug !== slug) })),

      isInWishlist: (slug) => get().wishlist.some((p) => p.slug === slug),

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "canbri-product-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        compare: s.compare,
        recentlyViewed: s.recentlyViewed,
        cart: s.cart,
        wishlist: s.wishlist,
      }),
    },
  ),
);

/** Convert a full Product to its minimal stored representation. */
export function toStoredProduct(p: {
  slug: string;
  name: string;
  category: string;
  image: string;
  shortDescription: string;
  minOrder?: string;
  leadTime?: string;
  rating?: number;
  reviewCount?: number;
}): StoredProduct {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.image,
    shortDescription: p.shortDescription,
    minOrder: p.minOrder,
    leadTime: p.leadTime,
    rating: p.rating,
    reviewCount: p.reviewCount,
  };
}
