"use client";

import { useCart } from "@/lib/cart/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

const getSafeImageSrc = (src: any) => {
  if (!src) return "/images/banner-sublimation-sports.svg";
  let s = "";
  if (typeof src === "string") {
    s = src.trim();
    if (s.startsWith("{") || s.startsWith("[")) {
      try {
        const parsed = JSON.parse(s);
        if (typeof parsed === "string") s = parsed;
        else if (parsed && typeof parsed === "object") s = parsed.src || parsed.url || parsed.path || "";
      } catch {
        // ignore
      }
    }
  } else if (typeof src === "object") {
    s = src.src || src.url || src.path || "";
  }
  if (!s || s === "null" || s === "undefined") return "/images/banner-sublimation-sports.svg";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("/")) {
    return s;
  }
  return `/${s}`;
};

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax for example
  const total = subtotal + tax;

  const handleQuantityChange = (item: typeof items[0], quantity: number) => {
    if (quantity <= 0) {
      removeItem({
        productId: item.productId,
        size: item.size,
        color: item.color,
      });
    } else {
      updateQuantity(
        {
          productId: item.productId,
          size: item.size,
          color: item.color,
        },
        quantity
      );
    }
  };

  const handleRemove = (item: typeof items[0]) => {
    removeItem({
      productId: item.productId,
      size: item.size,
      color: item.color,
    });
  };

  return (
    <main className="bg-white">
      {/* Breadcrumb */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="site-container py-3">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="inline-flex transition hover:text-[#00AEF0]">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-400">/</li>
            <li aria-current="page" className="font-semibold text-[#00AEF0] uppercase">
              Shopping Cart
            </li>
          </ol>
        </div>
      </nav>

      {/* Page Header */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-4">
              Shopping Cart
            </h1>
            <p className="text-lg text-zinc-600">
              {items.length === 0
                ? "Your cart is empty"
                : `${items.length} item${items.length === 1 ? "" : "s"} in your cart`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          {items.length === 0 ? (
            // Empty Cart State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <h2 className="text-2xl font-bold text-black mb-4">Your cart is empty</h2>
              <p className="text-zinc-600 mb-8">
                Start shopping to add items to your cart.
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-[#00AEF0] text-white font-semibold rounded hover:bg-[#0089bd] transition shadow-md shadow-[#00AEF0]/20"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border border-zinc-200 p-6 rounded-lg hover:shadow-lg transition"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 relative overflow-hidden rounded bg-slate-100 border border-slate-200">
                          <img
                            src={getSafeImageSrc(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/banner-sublimation-sports.svg";
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1">
                              <Link
                                href={`/products/${item.slug}`}
                                className="text-lg sm:text-xl font-bold text-black hover:text-[#00AEF0] transition line-clamp-2"
                              >
                                {item.name}
                              </Link>

                              {/* Attributes */}
                              <div className="mt-2 text-sm text-zinc-600">
                                {item.color && <p>Color: {item.color}</p>}
                                {item.size && <p>Size: {item.size}</p>}
                                <p className="mt-2 font-semibold text-black">
                                  ${(item.unitPrice).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {/* Quantity and Remove */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                              <div className="flex items-center border border-zinc-300 rounded">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item, item.quantity - 1)
                                  }
                                  className="p-2 hover:bg-zinc-100 transition"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-semibold">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item, item.quantity + 1)
                                  }
                                  className="p-2 hover:bg-zinc-100 transition"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemove(item)}
                                className="p-2 text-[#00AEF0] hover:bg-cyan-50 rounded transition"
                                aria-label="Remove item"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>

                          {/* Line Total */}
                          <div className="mt-4 flex justify-between items-end">
                            <span className="text-sm text-zinc-600">
                              Quantity: {item.quantity}
                            </span>
                            <span className="text-lg font-bold text-black">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Continue Shopping */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8"
                >
                  <Link
                    href="/products"
                    className="inline-block px-6 py-3 border border-black text-black font-semibold rounded hover:bg-black hover:text-white transition"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>

              {/* Order Summary Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <div className="border border-zinc-200 p-6 rounded-lg bg-zinc-50 sticky top-24">
                  <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>

                  <div className="space-y-4 border-b border-zinc-300 pb-6 mb-6">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Subtotal</span>
                      <span className="font-semibold text-black">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Tax</span>
                      <span className="font-semibold text-black">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Shipping</span>
                      <span className="font-semibold text-black">FREE</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-8">
                    <span className="text-lg font-bold text-black">Total</span>
                    <span className="text-2xl font-bold text-[#00AEF0]">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <button className="w-full px-6 py-4 bg-[#00AEF0] text-white font-semibold rounded hover:bg-[#0089bd] transition mb-4 shadow-md shadow-[#00AEF0]/20">
                    Proceed to Checkout
                  </button>

                  <p className="text-xs text-zinc-600 text-center">
                    Secure checkout powered by Estrella International
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

