import { useState, useEffect } from "react";
import { adminBookingsAPI } from "@/services/api";
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
  Search, CalendarDays, Clock, CheckCircle2, XCircle,
  Scissors, PawPrint, User, Phone, FileText, Download
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", variant: "outline", icon: Clock },
  confirmed: { label: "Confirmed", variant: "default", icon: CheckCircle2 },
  completed: { label: "Completed", variant: "default", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", variant: "destructive", icon: XCircle },
};

const STATUS_FLOW = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const PET_ICON = {
  kucing: "🐱",
  anjing: "🐕",
  kelinci: "🐰",
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusDialog, setStatusDialog] = useState({ open: false, bookingId: null, newStatus: "", currentStatus: "" });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await adminBookingsAPI.getAll();
      if (res.data.success) setBookings(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await adminBookingsAPI.getStats();
      if (res.data.success) setStats(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleStatusUpdate = async () => {
    try {
      const res = await adminBookingsAPI.updateStatus(statusDialog.bookingId, statusDialog.newStatus);
      if (res.data.success) {
        fetchBookings();
        fetchStats();
      }
    } catch (err) { console.error(err); }
    finally { setStatusDialog({ open: false, bookingId: null, newStatus: "", currentStatus: "" }); }
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      b.petName?.toLowerCase().includes(q) ||
      b.ownerName?.toLowerCase().includes(q) ||
      b.phone?.includes(q) ||
      b.service?.toLowerCase().includes(q) ||
      b.userId?.userName?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleExportCSV = () => {
    const dataToExport = filtered.map(b => ({
      "Booking ID": b._id,
      "Date": b.date,
      "Time": b.time,
      "Service": b.service,
      "Pet Name": b.petName,
      "Pet Type": b.petType,
      "Pet Age": b.petAge || "-",
      "Pet Weight": b.petWeight || "-",
      "Owner Name": b.ownerName,
      "Phone": b.phone,
      "Status": b.status,
      "Customer Email": b.userId?.email || "Unknown"
    }));
    exportToCSV(dataToExport, "admin_bookings");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Bookings", value: stats?.totalBookings || 0, icon: CalendarDays, desc: "All bookings" },
    { title: "Pending", value: stats?.pendingBookings || 0, icon: Clock, desc: "Awaiting confirmation" },
    { title: "Confirmed", value: stats?.confirmedBookings || 0, icon: CheckCircle2, desc: "Ready to serve" },
    { title: "Completed", value: stats?.completedBookings || 0, icon: Scissors, desc: "Services done" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage grooming & pet hotel reservations</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
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
              placeholder="Search bookings..."
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
                {s === "all" ? `All (${bookings.length})` : STATUS_CONFIG[s]?.label}
              </Button>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Bookings Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Pet</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((booking) => {
                const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                const nextStatuses = STATUS_FLOW[booking.status] || [];

                return (
                  <TableRow key={booking._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{booking.date}</p>
                          <p className="text-xs text-muted-foreground">{booking.time}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{booking.service}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{PET_ICON[booking.petType] || "🐾"}</span>
                        <div>
                          <p className="text-sm font-medium">{booking.petName}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {booking.petType}
                            {booking.petAge && ` · ${booking.petAge}`}
                            {booking.petWeight && ` · ${booking.petWeight}`}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{booking.ownerName}</p>
                        <p className="text-xs text-muted-foreground">{booking.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{booking.userId?.userName || "—"}</p>
                        <p className="text-xs text-muted-foreground">{booking.userId?.email || "—"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={booking.status === "pending" ? "bg-slate-100 text-slate-500" : "bg-green-100 text-green-700 border-green-200"}>
                        {booking.status === "pending" ? "Unpaid" : "Paid"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cfg.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
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
                                bookingId: booking._id,
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
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No bookings found
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
            <AlertDialogTitle>Update Booking Status</AlertDialogTitle>
            <AlertDialogDescription>
              Change booking status from <strong>{statusDialog.currentStatus}</strong> to{" "}
              <strong className="capitalize">{STATUS_CONFIG[statusDialog.newStatus]?.label || statusDialog.newStatus}</strong>?
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
