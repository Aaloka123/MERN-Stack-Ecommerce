  import React, { useState } from "react";
  import AdminNavbar from "../AdminComponent/AdminNavbar";

  type AdminProductRecord = {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    sizes: string[];
    description: string;
    images: string[];
  };

  const INITIAL_PRODUCTS: AdminProductRecord[] = [
    {
      id: "P-101",
      name: "Maroon Long Coat",
      category: "Women",
      price: 8000,
      stock: 14,
      sizes: ["S", "M", "L", "XL"],
      description: "Warm maroon coat with a relaxed, tailored fit for winter days.",
      images: [],
    },
    {
      id: "P-102",
      name: "Blue Summer Dress",
      category: "Women",
      price: 6500,
      stock: 22,
      sizes: ["XS", "S", "M", "L"],
      description: "Lightweight blue dress perfect for summer evenings.",
      images: [],
    },
    {
      id: "P-103",
      name: "White Casual Shirt",
      category: "Men",
      price: 4500,
      stock: 30,
      sizes: ["M", "L", "XL"],
      description: "Everyday white shirt that pairs with anything.",
      images: [],
    },
  ];

  const AdminProduct: React.FC = () => {
    const [products, setProducts] =
      useState<AdminProductRecord[]>(INITIAL_PRODUCTS);
    const [search, setSearch] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Women");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [sizes, setSizes] = useState<string[]>(["S", "M", "L"]);
    const [errors, setErrors] = useState<{
      name?: string;
      price?: string;
      stock?: string;
      description?: string;
      photos?: string;
    }>({});
    const [description, setDescription] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);

    const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = (e.target.files || [])[0];
      if (!file) return;

      // prevent more than 4 images total
      if (photos.length >= 4) return;

      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        if (!result) return;
        setPhotos((prev) =>
          prev.length >= 4 ? prev : [...prev, result].slice(0, 4)
        );
      };
      reader.readAsDataURL(file);
      // reset the input so the same file can be selected again if needed
      e.target.value = "";
    };

    const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      const nextErrors: {
        name?: string;
        price?: string;
        stock?: string;
        description?: string;
        photos?: string;
      } = {};

      if (!name.trim()) nextErrors.name = "Name is required";
      if (!category.trim()) nextErrors.name = "Category is required";

      const priceNum = Number(price);
      if (!price.trim()) {
        nextErrors.price = "Price is required";
      } else if (Number.isNaN(priceNum) || priceNum <= 0) {
        nextErrors.price = "Enter a valid price";
      }

      const stockNum = Number(stock);
      if (!stock.trim()) {
        nextErrors.stock = "Stock is required";
      } else if (!Number.isInteger(stockNum) || stockNum < 0) {
        nextErrors.stock = "Stock must be a whole number";
      }

      if (!description.trim()) {
        nextErrors.description = "Description is required";
      }

      const images = photos.filter(Boolean);
      if (images.length === 0) {
        nextErrors.photos = "Add at least one product image URL";
      }

      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      const next: AdminProductRecord = {
        id: `P-${Math.floor(100 + Math.random() * 900)}`,
        name: name.trim(),
        category,
        price: priceNum,
        stock: stockNum,
        sizes,
        description: description.trim(),
        images: images.slice(0, 4),
      };
      setProducts((prev) => [next, ...prev]);
      setName("");
      setCategory("Women");
      setPrice("");
      setStock("");
      setSizes(["S", "M", "L"]);
      setDescription("");
      setPhotos([]);
    };

    const handleDelete = (id: string) => {
      if (!window.confirm("Remove this product?")) return;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const filteredProducts = products.filter((p) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        String(p.price).includes(term)
      );
    });

    return (
      <div className="flex min-h-screen bg-[#f4f0ea]">
        <AdminNavbar />

        <main className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto">
          <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2b1b1b]">
              Products
            </h1>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm border border-[#e6ddd0] max-w-xs w-full sm:w-64">
                <span className="text-xs font-semibold tracking-[0.18em] text-gray-500">
                  SEARCH
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none"
               
                />
              </div>
            </div>
          </header>

          {/* Add product form */}
          <section className="mb-6 rounded-2xl bg-white shadow-sm border border-[#e6ddd0] px-4 sm:px-6 py-5">
            <h2 className="text-base font-semibold text-[#2b1b1b]">
              Add new product
            </h2>
            <form
              onSubmit={handleAdd}
              className="mt-4 grid gap-4 text-sm text-gray-800 sm:grid-cols-3"
            >
              <div className="sm:col-span-1">
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdf7f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                  placeholder="Product name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdf7f0] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                >
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Price (Rs.)</label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdf7f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                  placeholder="8000"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Stock</label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdf7f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL"].map((size) => {
                    const checked = sizes.includes(size);
                    return (
                      <label
                        key={size}
                        className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs cursor-pointer ${
                          checked
                            ? "border-[#7b1b2b] bg-[#7b1b2b] text-white"
                            : "border-[#e2c9a5] bg-[#fdf7f0] text-gray-800"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checked}
                          onChange={() =>
                            setSizes((prev) =>
                              prev.includes(size)
                                ? prev.filter((s) => s !== size)
                                : [...prev, size]
                            )
                          }
                        />
                        <span className="text-xs font-medium">{size}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdf7f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b] resize-none"
                  placeholder="Short description of the product"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label className="block mb-1 font-medium">
                  Product images
                  <span className="text-xs text-gray-500">
                    {" "}
                    · add up to 4 photos
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotosChange}
                  className="w-full text-sm rounded-lg border border-[#e2c9a5] bg-[#fdf7f0] px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                />
                {errors.photos && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.photos}
                  </p>
                )}
                {photos.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {photos.slice(0, 4).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-16 w-16 rounded-md overflow-hidden border border-[#e2c9a5]"
                      >
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPhotos((prev) =>
                              prev.filter((_, index) => index !== idx)
                            )
                          }
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#7b1b2b] text-[10px] font-bold text-white flex items-center justify-center shadow"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-3 flex justify-center">
                <button
                  type="submit"
                  className="rounded-full bg-[#7b1b2b] px-5 py-2 text-sm font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors"
                >
                  ADD PRODUCT
                </button>
              </div>
            </form>
          </section>

          {/* Product table */}
          <section className="rounded-2xl bg-white shadow-sm border border-[#e6ddd0] px-4 sm:px-6 py-5">
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-gray-700">No products found.</p>
            ) : (
              <div className="overflow-x-auto text-sm text-gray-800">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    <tr>
                      <th className="text-left">Name</th>
                      <th className="text-left">Category</th>
                      <th className="text-left">Price</th>
                      <th className="text-left">Stock</th>
                      <th className="text-left">Sizes</th>
                      <th className="text-left">Description</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="align-middle">
                        <td className="py-1 pr-4">{product.name}</td>
                        <td className="py-1 pr-4">{product.category}</td>
                        <td className="py-1 pr-4">
                          Rs. {product.price.toLocaleString("en-IN")}
                        </td>
                        <td className="py-1 pr-4">{product.stock}</td>
                        <td className="py-1 pr-4">
                          {product.sizes && product.sizes.length
                            ? product.sizes.join(", ")
                            : "-"}
                        </td>
                        <td className="py-1 pr-4 max-w-[220px]">
                          {product.description.length > 80
                            ? product.description.slice(0, 77) + "..."
                            : product.description}
                        </td>
                        <td className="py-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="rounded-full border border-red-500 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  };

  export default AdminProduct;