import { useState, useEffect } from "react";
import { adminOrdersAPI } from "@/services/api";
import { exportToCSV } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search, Package, Clock, CheckCircle2, Truck, XCircle,
  ShoppingBag, DollarSign, ChevronDown, ChevronUp, Eye,
  ArrowUpRight, ArrowDownRight, Download,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", variant: "outline", icon: Clock, color: "text-yellow-500" },
  confirmed: { label: "Menunggu Konfirmasi", variant: "default", icon: CheckCircle2, color: "text-blue-500" },
  processing: { label: "Processing", variant: "secondary", icon: Package, color: "text-purple-500" },
  shipped: { label: "Shipped", variant: "default", icon: Truck, color: "text-teal-500" },
  completed: { label: "Completed", variant: "default", icon: CheckCircle2, color: "text-green-500" },
  cancelled: { label: "Cancelled", variant: "destructive", icon: XCircle, color: "text-red-500" },
};

const STATUS_FLOW = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["completed"],
  completed: [],
  cancelled: [],
};

const fmtPrice = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [statusDialog, setStatusDialog] = useState({ open: false, orderId: null, newStatus: "", currentStatus: "" });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await adminOrdersAPI.getAll();
      if (res.data.success) setOrders(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await adminOrdersAPI.getStats();
      if (res.data.success) setStats(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleStatusUpdate = async () => {
    try {
      const res = await adminOrdersAPI.updateStatus(statusDialog.orderId, statusDialog.newStatus);
      if (res.data.success) {
        fetchOrders();
        fetchStats();
      }
    } catch (err) { console.error(err); }
    finally { setStatusDialog({ open: false, orderId: null, newStatus: "", currentStatus: "" }); }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      o._id?.toLowerCase().includes(q) ||
      o.userId?.userName?.toLowerCase().includes(q) ||
      o.userId?.email?.toLowerCase().includes(q) ||
      o.items?.some((i) => i.title?.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const handleExportCSV = () => {
    const dataToExport = filtered.map(o => ({
      "Order ID": o._id,
      "Customer Name": o.userId?.userName || "Unknown",
      "Customer Email": o.userId?.email || "Unknown",
      "Items Count": o.items?.length || 0,
      "Subtotal": o.subtotal || 0,
      "Shipping Cost": o.shippingCost || 0,
      "Total Amount": o.total,
      "Status": o.status,
      "Payment Method": o.paymentMethod || "-",
      "Shipping Method": o.shippingMethod?.label || "-",
      "Date": fmtDate(o.createdAt)
    }));
    exportToCSV(dataToExport, "admin_orders");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, desc: "All orders" },
    { title: "Pending", value: stats?.pendingOrders || 0, icon: Clock, desc: "Awaiting payment", color: "text-yellow-500" },
    { title: "Processing", value: stats?.processingOrders || 0, icon: Package, desc: "Being prepared", color: "text-purple-500" },
    { title: "Revenue", value: fmtPrice(stats?.totalRevenue || 0), icon: DollarSign, desc: "Total revenue", isText: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`${s.isText ? "text-xl" : "text-3xl"} font-bold`}>{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", ...Object.keys(STATUS_CONFIG)].map((s) => (
              <Button
                key={s}
                variant={filterStatus === s ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(s)}
                className="capitalize"
              >
                {s === "all" ? `All (${orders.length})` : STATUS_CONFIG[s]?.label}
              </Button>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>


      {/* Orders Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                const isExpanded = expandedId === order._id;
                const nextStatuses = STATUS_FLOW[order.status] || [];

                return (
                  <>
                    <TableRow key={order._id} className="cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : order._id)}>
                      <TableCell>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        #{order._id?.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{order.userId?.userName || "—"}</p>
                          <p className="text-xs text-muted-foreground">{order.userId?.email || "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.items?.length || 0} produk
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        {fmtPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={order.status === "pending" ? "bg-slate-100 text-slate-500" : "bg-green-100 text-green-700 border-green-200"}>
                          {order.status === "pending" ? "Unpaid" : "Paid"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cfg.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {fmtDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1 justify-end">
                          {nextStatuses.map((ns) => {
                            const nsCfg = STATUS_CONFIG[ns];
                            return (
                              <Button
                                key={ns}
                                variant={ns === "cancelled" ? "destructive" : "outline"}
                                size="sm"
                                className="text-xs"
                                onClick={() => setStatusDialog({
                                  open: true,
                                  orderId: order._id,
                                  newStatus: ns,
                                  currentStatus: cfg.label,
                                })}
                              >
                                {nsCfg.label}
                              </Button>
                            );
                          })}
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <TableRow key={`${order._id}-detail`}>
                        <TableCell colSpan={8} className="bg-muted/30 p-0">
                          <div className="p-4 space-y-4">
                            {/* Items */}
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Items</h4>
                              <div className="space-y-2">
                                {order.items?.map((item, i) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                      {item.image
                                        ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                        : <div className="h-full w-full flex items-center justify-center"><Package className="h-4 w-4 text-muted-foreground" /></div>
                                      }
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{item.title}</p>
                                      <p className="text-xs text-muted-foreground">{item.qty} × {fmtPrice(item.price)}</p>
                                    </div>
                                    <p className="text-sm font-semibold">{fmtPrice(item.price * item.qty)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Summary */}
                            <div className="grid gap-4 sm:grid-cols-3">
                              <div className="rounded-lg border p-3 space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Shipping Address</p>
                                <p className="text-sm font-medium">{order.shippingAddress?.name}</p>
                                <p className="text-xs text-muted-foreground">{order.shippingAddress?.phone}</p>
                                <p className="text-xs text-muted-foreground break-words whitespace-pre-wrap">
                                  {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postalCode}
                                </p>
                              </div>
                              <div className="rounded-lg border p-3 space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Payment</p>
                                <p className="text-sm font-medium capitalize">{order.paymentMethod || "—"}</p>
                                <p className="text-xs text-muted-foreground">
                                  Shipping: {order.shippingMethod?.label || "—"} ({fmtPrice(order.shippingCost)})
                                </p>
                              </div>
                              <div className="rounded-lg border p-3 space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Total</p>
                                <p className="text-xs text-muted-foreground">Subtotal: {fmtPrice(order.subtotal)}</p>
                                <p className="text-xs text-muted-foreground">Shipping: {fmtPrice(order.shippingCost)}</p>
                                <p className="text-sm font-bold text-primary">{fmtPrice(order.total)}</p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Status Update Dialog */}
      <AlertDialog open={statusDialog.open} onOpenChange={(open) => setStatusDialog({ ...statusDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Order Status</AlertDialogTitle>
            <AlertDialogDescription>
              Change order status from <strong>{statusDialog.currentStatus}</strong> to{" "}
              <strong className="capitalize">{STATUS_CONFIG[statusDialog.newStatus]?.label || statusDialog.newStatus}</strong>?
              {statusDialog.newStatus === "cancelled" && (
                <span className="block mt-2 text-destructive">
                  This will restore the product stock and cannot be undone.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusUpdate}
              className={statusDialog.newStatus === "cancelled" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
