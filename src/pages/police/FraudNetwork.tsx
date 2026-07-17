import { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { fetchFraudNetwork } from "@/services/police";
import type { FraudNode, FraudEdge } from "@/types/api";
import { Loader2, Maximize2, Network, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

export default function FraudNetwork() {
  const { theme } = useTheme();
  const [nodes, setNodes] = useState<FraudNode[]>([]);
  const [edges, setEdges] = useState<FraudEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const fgRef = useRef<any>(null);

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const data = await fetchFraudNetwork();
        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial load
    loadGraph();
    
    // Poll every 5 seconds for dynamic updates
    const interval = setInterval(loadGraph, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCenter = () => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 50);
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "suspect": return "#EF4444"; // red
      case "bank_account": 
      case "account": return "#F59E0B"; // amber
      case "phone_number": 
      case "phone": return "#3B82F6"; // blue
      case "ip_address": 
      case "device": return "#10B981"; // emerald
      default: return "#6B7280";
    }
  };

  const getEdgeColor = (type: string) => {
    switch (type) {
      case "transferred_to": return "#EF4444"; 
      case "called": return "#3B82F6";
      default: return theme === "dark" ? "#4B5563" : "#D1D5DB";
    }
  };

  const filteredNodes = search 
    ? nodes.filter(n => n.label.toLowerCase().includes(search.toLowerCase()) || n.id.toLowerCase().includes(search.toLowerCase()))
    : nodes;

  const filteredEdges = search
    ? edges.filter(e => filteredNodes.some(n => n.id === e.source || n.id === e.target))
    : edges;

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col">
      <div className="p-6 border-b border-border bg-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Network className="h-6 w-6 text-primary" />
              Graph AI: Fraud Ring Network
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Visualizing connections between suspects, phone numbers, and bank accounts.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative max-w-sm w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search nodes (e.g. +91...)"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={handleCenter}
              className="p-2.5 bg-muted hover:bg-muted/80 rounded-md transition-colors"
              title="Center Graph"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-background overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="font-medium text-muted-foreground">Running Graph Algorithms...</p>
          </div>
        ) : (
          <>
            <ForceGraph2D
              ref={fgRef}
              graphData={{ nodes: filteredNodes, links: filteredEdges }}
              nodeColor={node => getNodeColor((node as any).type)}
              nodeLabel={node => `${(node as any).label} (${(node as any).type})`}
              nodeRelSize={6}
              linkColor={link => getEdgeColor((link as any).type)}
              linkWidth={2}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.005}
              backgroundColor={theme === "dark" ? "#09090b" : "#ffffff"}
              onNodeClick={(node) => {
                if (fgRef.current) {
                  fgRef.current.centerAt(node.x, node.y, 1000);
                  fgRef.current.zoom(8, 2000);
                }
              }}
            />

            {/* Legend Overlay */}
            <Card className="absolute bottom-6 right-6 p-4 shadow-xl bg-card/90 backdrop-blur-md">
              <h3 className="font-semibold text-sm mb-3">Node Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div>Suspect</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div>Bank Account</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Phone Number</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>IP Address</div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
