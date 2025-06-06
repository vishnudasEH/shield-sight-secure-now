
import { NucleiVulnerabilities } from "@/components/NucleiVulnerabilities";

const NucleiVulnerabilitiesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Nuclei Vulnerabilities</h1>
          <p className="text-slate-400">
            Manage and track vulnerabilities discovered through nuclei security scans
          </p>
        </div>
        <NucleiVulnerabilities />
      </div>
    </div>
  );
};

export default NucleiVulnerabilitiesPage;
