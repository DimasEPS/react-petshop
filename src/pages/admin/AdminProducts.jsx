import { useState, useEffect } from "react";
import { adminProductsAPI } from "@/services/api";
import { exportToCSV } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, ImagePlus, Search, Download } from "lucide-react";

const categories = ["Anjing", "Kucing", "Kelinci", "Aksesoris", "Makanan"];

const emptyForm = {
  image: "", title: "", description: "", categories: [],
  brand: "", price: "", salePrice: "", stock: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await adminProductsAPI.getAll();
      if (res.data.success) setProducts(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setFormError("");
    try {
      const fd = new FormData();
      fd.append("imageFile", file);
      const res = await adminProductsAPI.uploadImage(fd);
      if (res.data.success) {
        setForm((prev) => ({ ...prev, image: res.data.result.secure_url }));
      }
    } catch (err) {
      console.error(err);
      setFormError("Image upload failed. You can still save without an image.");
    }
    finally { setUploading(false); }
  };

  const openAddDialog = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
    setDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setForm({
      image: product.image || "",
      title: product.title || "",
      description: product.description || "",
      categories: Array.isArray(product.category) ? product.category : 
                  (product.category ? [product.category] : []),
      brand: product.brand || "",
      price: product.price?.toString() || "",
      salePrice: product.salePrice?.toString() || "",
      stock: product.stock?.toString() || "",
    });
    setEditingId(product._id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setFormError("");
    if (!form.title || form.categories.length === 0 || !form.brand || !form.price || !form.stock) {
      setFormError("Please fill in all required fields (title, category, brand, price, stock).");
      return;
    }
    setSaving(true);
    try {
      const animals = ["kucing", "anjing", "kelinci"];
      const payload = {
        ...form,
        category: form.categories, // Send as array
        hewan: form.categories.filter(c => animals.includes(c.toLowerCase())).map(c => c.toLowerCase()),
        kat: form.categories.filter(c => !animals.includes(c.toLowerCase())),
        price: Number(form.price),
        salePrice: Number(form.salePrice) || 0,
        stock: Number(form.stock),
      };
      if (editingId) {
        await adminProductsAPI.edit(editingId, payload);
      } else {
        await adminProductsAPI.add(payload);
      }
      setDialogOpen(false);
      setFormError("");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setFormError("Failed to save product. Please try again.");
    }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await adminProductsAPI.delete(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(p.category) ? p.category.join(" ") : p.category)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const dataToExport = filtered.map(p => ({
      "Product ID": p._id,
      "Title": p.title,
      "Category": Array.isArray(p.category) ? p.category.join(", ") : p.category,
      "Brand": p.brand,
      "Price": p.price,
      "Sale Price": p.salePrice || 0,
      "Stock": p.stock,
      "Description": p.description,
    }));
    exportToCSV(dataToExport, "admin_products");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} products in catalog</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? filtered.map((p) => (
              <TableRow key={p._id}>
                <TableCell>
                  <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                    {p.image ? <img src={p.image} alt={p.title} className="h-full w-full object-cover" /> : null}
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                <TableCell>
                  {Array.isArray(p.category) ? (
                    <div className="flex flex-wrap gap-1">
                      {p.category.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                    </div>
                  ) : (
                    <Badge variant="outline">{p.category}</Badge>
                  )}
                </TableCell>
                <TableCell>Rp {p.price?.toLocaleString("id-ID")}</TableCell>
                <TableCell>{p.salePrice > 0 ? `Rp ${p.salePrice?.toLocaleString("id-ID")}` : "-"}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteDialog({ open: true, id: p._id })}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {formError}
              </div>
            )}
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center gap-4">
                {form.image ? (
                  <img src={form.image} alt="Preview" className="h-20 w-20 rounded-lg object-cover border" />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center border border-dashed">
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="w-auto" />
                  {uploading && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Uploading...</p>}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((c) => (
                    <label key={c} className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-slate-50">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                        checked={form.categories.includes(c)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({ ...form, categories: [...form.categories, c] });
                          } else {
                            setForm({ ...form, categories: form.categories.filter(cat => cat !== c) });
                          }
                        }}
                      />
                      <span className="text-sm">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input id="salePrice" type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the product.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
