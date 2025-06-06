
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Square } from "lucide-react";

interface ScanControlsProps {
  isScanning: boolean;
  scanProgress: number;
  onStartScan: () => void;
  onStopScan: () => void;
}

export const ScanControls = ({
  isScanning,
  scanProgress,
  onStartScan,
  onStopScan
}: ScanControlsProps) => {
  return (
    <div className="pt-4 border-t border-slate-700">
      {isScanning ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Nuclei scan in progress...</span>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              {scanProgress.toFixed(0)}% Complete
            </Badge>
          </div>
          <Progress value={scanProgress} className="h-2" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={onStopScan} className="border-slate-600">
              <Square className="h-4 w-4 mr-2" />
              Stop Scan
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button onClick={onStartScan} className="bg-blue-600 hover:bg-blue-700">
            <Play className="h-4 w-4 mr-2" />
            Execute Scan
          </Button>
        </div>
      )}
    </div>
  );
};
