import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_URL = "http://localhost:3000";

const AdminKeyDialog = ({ isOpen, onAuthenticate }) => {
  const [adminKey, setAdminKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthenticate(adminKey);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Admin Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminKey">Admin Key</Label>
              <Input
                id="adminKey"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Authenticate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Metrics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(true);

  const handleAuthenticate = async (adminKey) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminKey }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setIsAuthDialogOpen(false);
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/metrics/export`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "platform_metrics_export.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error("Failed to download CSV");
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminKeyDialog
        isOpen={isAuthDialogOpen}
        onAuthenticate={handleAuthenticate}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl flex flex-col items-center justify-center min-h-screen">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-indigo-700 mb-6">
        Platform Metrics
      </h1>

      <Button
        onClick={handleExportCSV}
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export Full Metrics CSV
      </Button>
    </div>
  );
};

export default Metrics;
