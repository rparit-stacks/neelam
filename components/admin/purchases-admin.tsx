"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabase } from "@/lib/supabase"
import type { Purchase } from "@/lib/types"

export function PurchasesAdmin() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPurchases()
  }, [])

  async function fetchPurchases() {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("purchases").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      setPurchases(data)
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Purchases</CardTitle>
        <CardDescription>View all customer purchases and payment status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{purchase.user_name || purchase.user_email}</h3>
                  <Badge variant={purchase.payment_status === "completed" ? "default" : "secondary"}>
                    {purchase.payment_status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {purchase.product_type} • ₹{purchase.amount} • {new Date(purchase.created_at).toLocaleDateString()}
                </p>
                {purchase.razorpay_payment_id && (
                  <p className="text-xs text-muted-foreground mt-1">Payment ID: {purchase.razorpay_payment_id}</p>
                )}
              </div>
            </div>
          ))}
          {purchases.length === 0 && !loading && (
            <p className="text-center text-muted-foreground py-8">No purchases yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
