import { useState, useEffect } from "react";
import { adminUsersAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Users, ShieldCheck, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await adminUsersAPI.getDashboardStats();
      if (res.data.success) setStats(res.data.data);
    } catch (err) { console.error("Failed to fetch stats:", err); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Products", value: stats?.totalProducts || 0, icon: Package, desc: "Products in catalog" },
    { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, desc: "Registered users" },
    { title: "Admin Users", value: stats?.totalAdmins || 0, icon: ShieldCheck, desc: "Admin accounts" },
    { title: "Growth", value: stats?.totalUsers || 0, icon: TrendingUp, desc: "All time registrations" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your store performance</p>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Products</CardTitle></CardHeader>
          <CardContent>
            {stats?.recentProducts?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentProducts.map((p) => (
                  <div key={p._id} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {p.image ? <img src={p.image} alt={p.title} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center"><Package className="h-4 w-4 text-muted-foreground" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">Rp {p.price?.toLocaleString("id-ID")}</p>
                      {p.salePrice > 0 && p.salePrice < p.price && <Badge variant="secondary" className="text-xs">Sale</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-4">No products yet</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Users</CardTitle></CardHeader>
          <CardContent>
            {stats?.recentUsers?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentUsers.map((u) => (
                  <div key={u._id} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary flex-shrink-0">
                      {u.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-xs">{u.role}</Badge>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-4">No users yet</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
