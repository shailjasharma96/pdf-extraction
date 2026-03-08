"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { 
  FileText, 
  Upload, 
  Search as SearchIcon, 
  LogOut, 
  LayoutDashboard, 
  Database,
  Eye,
  FileSearch,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Filter
} from "lucide-react";

type Transaction = {
  id?: number;
  documentType?: string;
  department?: string;
  searchPeriod?: string;
  subRegistrarOffice?: string;
  surveyNumbers?: string;
  propertyType?: string;
  village?: string;
  recordedTransaction?: string;
  documentNumber?: string;
  registeredDate?: string;
  partyName?: string;
  partyNameTamil?: string;
  houseNumber?: string;
  sourcePdfUrl?: string;
  villageTamil?: string;
  propertyTypeTamil?: string;
  recordedTransactionTamil?: string;
};

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState({
    buyerName: "",
    sellerName: "",
    houseNumber: "",
    surveyNumbers: "",
    documentNumber: "",
    partyName: "",
    village: "",
  });
  const [activeFilter, setActiveFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Transaction | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      window.location.href = "/login";
    } else {
      fetchInitialData();
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions?limit=5`);
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  const upload = async () => {
    if (!file) {
      alert("Please select a PDF file first");
      return;
    }

    const form = new FormData();
    form.append("pdf", file);

    setPdfUrl(URL.createObjectURL(file));
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/upload`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const currentPdfUrl = URL.createObjectURL(file);
      setPdfUrl(currentPdfUrl);
      
      const rowsWithSource = res.data.map((r: any) => ({
        ...r,
        sourcePdfUrl: currentPdfUrl
      }));

      setData(prev => [...rowsWithSource, ...prev]);
      setIsUploadModalOpen(false); // Close modal on success
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error);
      setErrorMessage("Failed to upload and process the PDF. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const search = async () => {
    setErrorMessage("");

    if (!activeFilter || !searchValue) {
      setErrorMessage("Please select a filter category and enter a search term.");
      return;
    }

    setSearchLoading(true);

    try {
      const searchParams = {
        [activeFilter]: searchValue,
      };

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
        {
          params: searchParams,
        }
      );

      setData(res.data);
    } catch (error: any) {
      console.error("Search error:", error.response?.data || error);
      setErrorMessage("Failed to search transactions.");
    } finally {
      setSearchLoading(false);
    }
  };

  const rows = useMemo(() => data ?? [], [data]);

  return (
    <div className="min-h-screen pb-12 bg-slate-50/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-[60] px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Extraction Engine</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Master Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-all rounded-[8px] hover:bg-red-50"
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                window.location.href = "/login";
              }}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6">
        {errorMessage && (
          <div className="group flex items-center justify-between gap-3 p-3 bg-red-50/80 backdrop-blur border border-red-100 rounded-xl text-red-600 text-xs font-semibold animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} />
              {errorMessage}
            </div>
            <button onClick={() => setErrorMessage("")} className="p-1 hover:bg-red-100 rounded-md transition-colors">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Action & Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 glass-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Database size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Extractions</p>
                <h3 className="text-2xl font-black text-slate-900">{rows.length}</h3>
              </div>
            </div>

            <div className="flex-[1.5] glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${loading ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Status</p>
                  <h3 className="text-sm font-bold text-slate-800">{loading ? 'Processing...' : 'Operational'}</h3>
                </div>
              </div>
              
              <button
                className="premium-button !py-2 !px-4 text-[11px] font-black h-10 shadow-indigo-100/50"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <Upload size={14} />
                  <span>UPLOAD PDF</span>
                </div>
              </button>
            </div>
          </div>

          <div className="md:col-span-4 flex items-center">
             <div className="w-full glass-card p-4 bg-slate-100/50 border-slate-200/60 flex items-center justify-center gap-4 text-center">
                <div className="flex flex-col items-center">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">Session Continuity</p>
                   <p className="text-[9px] font-medium text-slate-400 mt-1 italic">Drizzle ORM + PG Active</p>
                </div>
             </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex flex-col xl:flex-row gap-6 items-stretch min-h-[700px]">
          {/* Results Table Section */}
          <div className="flex-1 w-full xl:min-w-0 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
              <h2 className="text-xs font-black text-slate-800 flex items-center gap-2.5 uppercase tracking-widest">
                <FileSearch size={14} className="text-indigo-600" />
                EXTRACTED INTELLIGENCE
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:justify-end max-w-2xl text-[10px]">
                <div className="relative w-full sm:w-[160px]">
                  <select
                    className={`w-full h-11 pl-10 pr-4 text-[11px] font-bold bg-white border border-slate-200 rounded-[8px] appearance-none cursor-pointer focus:ring-4 focus:ring-indigo-500/10 transition-all ${!activeFilter ? 'text-slate-300' : 'text-slate-900'}`}
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                  >
                    <option value="" disabled>Filter by</option>
                    <option value="buyerName">BUYER NAME</option>
                    <option value="sellerName">SELLER NAME</option>
                    <option value="houseNumber">HOUSE UNIT</option>
                    <option value="surveyNumbers">SURVEY ID</option>
                    <option value="documentNumber">DOC REFERENCE</option>
                  </select>
                  <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>

                <div className="relative w-full sm:w-[160px]">
                  <input
                    className="w-full h-11 pl-12 pr-4 bg-white border border-slate-200 rounded-[8px] text-[11px] font-bold tracking-tight text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                    placeholder="Enter text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && search()}
                  />
                  <SearchIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>

                <button
                  className="h-11 px-8 bg-slate-900 text-white rounded-[8px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-xl hover:shadow-black/10 transition-all active:scale-95 disabled:opacity-50"
                  onClick={search}
                  disabled={searchLoading}
                >
                  {searchLoading ? <Loader2 size={14} className="animate-spin" /> : "SEARCH"}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
              <table className="w-full min-w-[1200px] border-separate border-spacing-0">
                <thead className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm">
                  <tr>
                    {[
                      "Document Signature", 
                      "Dept Authority", 
                      "Timeframe", 
                      "Reg Office", 
                      "Land Property", 
                      "Locality", 
                      "Action Type", 
                      "Ref ID", 
                      "Parties Involved"
                    ].map((title) => (
                      <th key={title} className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] text-left border-b border-slate-200/60">
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60">
                  {rows.length > 0 ? (
                    rows.map((row, index) => (
                      <tr 
                        key={row.id ?? `${index}-${row.documentNumber}`} 
                        className={`group cursor-pointer transition-all animate-in fade-in slide-in-from-left-2 duration-300 ${selectedRow?.id === row.id ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50/40'}`}
                        style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                        onClick={() => setSelectedRow(row)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 leading-tight">{row.documentType || "Standard EC"}</span>
                            <span className="text-[9px] font-medium text-slate-400 mt-0.5">VERIFIED RECORD</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[10px] font-bold text-slate-500 leading-tight max-w-[140px] truncate uppercase tracking-tighter">
                            {row.department || "TAMIL NADU REGISTRATION"}
                          </p>
                        </td>
                        <td className="px-6 py-5 font-mono text-[10px] text-indigo-500 font-black whitespace-nowrap">
                          {row.searchPeriod || "—"}
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">{row.subRegistrarOffice || "—"}</span>
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">SRO_HUB</span>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-indigo-600 font-mono tracking-tighter leading-none">{row.surveyNumbers || "—"}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{row.propertyType || "N/A"}</span>
                               {row.propertyTypeTamil && (
                                 <span className="text-[10px] text-slate-300 font-tamil leading-none">{row.propertyTypeTamil}</span>
                               )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-medium text-slate-600">{row.village || "—"}</span>
                              {row.villageTamil && (
                                <span className="text-[10px] text-slate-400 font-tamil mt-0.5">{row.villageTamil}</span>
                              )}
                           </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                             <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-black border border-emerald-100 uppercase tracking-widest whitespace-nowrap w-fit">
                               {row.recordedTransaction?.split(' ')[0] || "ACTION"}
                             </div>
                             {row.sourcePdfUrl && (
                                <div className="flex items-center gap-1 text-[8px] font-black text-indigo-400 tracking-widest">
                                   <div className="w-1 h-1 rounded-full bg-indigo-400" />
                                   SOURCE_LINKED
                                </div>
                             )}
                          </div>
                        </td>
                        <td className="px-6 py-5 font-mono text-[11px] font-black text-slate-400 tracking-tighter">
                          {row.documentNumber || "—"}
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex flex-col">
                              <p className="text-[11px] font-black text-slate-800 tracking-tight leading-tight max-w-[180px] truncate uppercase">{row.partyName || "—"}</p>
                              {row.partyNameTamil && (
                                <p className="text-[10px] text-slate-400 font-tamil mt-0.5 truncate max-w-[180px]">{row.partyNameTamil}</p>
                              )}
                           </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-40">
                          <Database size={40} className="text-slate-300" />
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">No Active Intelligence Detected</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dual-Flux Comparison Sidebar */}
          <div className="w-full xl:w-[480px] flex flex-col gap-6 shrink-0 h-[800px] xl:h-[calc(100vh-140px)] xl:sticky xl:top-[88px]">
             <div className="flex-1 bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl border border-white/5 flex flex-col">
                {/* Full-Height PDF Source View */}
                <div className="flex-1 flex flex-col relative h-full">
                   <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${selectedRow?.sourcePdfUrl || pdfUrl ? 'bg-indigo-500 animate-pulse' : 'bg-slate-600'}`} />
                         <span className="text-[9px] font-black text-white/90 uppercase tracking-[0.2em]">
                           {selectedRow ? "Preview Doc" : "Live Source Intelligence"}
                         </span>
                      </div>
                      {(selectedRow?.sourcePdfUrl || pdfUrl) && (
                         <div className="flex items-center gap-2">
                            {selectedRow && (
                              <button 
                                onClick={() => setSelectedRow(null)}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[9px] font-black rounded-[8px] border border-white/10 uppercase tracking-widest transition-all"
                              >
                                Reset
                              </button>
                            )}
                            <a 
                               href={selectedRow?.sourcePdfUrl || pdfUrl} 
                               target="_blank" 
                               className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all shadow-xl"
                            >
                               <Eye size={14} />
                            </a>
                         </div>
                      )}
                   </div>

                   <div className="flex-1 pt-16 pb-4 px-3">
                      {selectedRow?.sourcePdfUrl || pdfUrl ? (
                         <iframe
                            src={`${selectedRow?.sourcePdfUrl || pdfUrl}#toolbar=0&navpanes=0`}
                            title="Source Doc"
                            className="w-full h-full rounded-2xl border-0 bg-slate-800 shadow-2xl"
                         />
                      ) : (
                         <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mb-6 animate-pulse">
                               <FileText size={32} className="text-white/20" />
                            </div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Intelligence Matrix Offline</p>
                            <p className="text-[9px] text-white/10 mt-2 italic tracking-tighter">Awaiting Source PDF Upload</p>
                         </div>
                      )}
                   </div>
                </div>

                {/* Footer Matrix Status */}
                <div className="p-4 border-t border-white/5 bg-black/40 mt-auto">
                   <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                         <div className={`w-6 h-6 rounded-full border border-slate-900 transition-colors ${selectedRow ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                         <div className="w-6 h-6 rounded-full border border-slate-900 bg-slate-800" />
                      </div>
                      <span className="text-[9px] font-bold text-white/30 font-mono tracking-tight uppercase">
                        Comparison_Sync_V4.2
                      </span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => !loading && setIsUploadModalOpen(false)}
          />
          <div className="glass-card w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative z-10">
            <div className="bg-gradient-to-r from-indigo-50 to-white px-8 py-5 border-b border-indigo-100 flex items-center justify-between">
              <h2 className="text-sm font-medium text-indigo-700 flex items-center gap-2.5 uppercase tracking-tight">
                <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-sm shadow-indigo-200">
                  <Upload size={16} />
                </div>
                Upload New Document
              </h2>
              {!loading && (
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            <div className="p-8">
              <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors group relative cursor-pointer">
                <input
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer z-[5]"
                  disabled={loading}
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    setFile(selectedFile);
                    if (selectedFile) {
                      setPdfUrl(URL.createObjectURL(selectedFile));
                    } else {
                      setPdfUrl("");
                    }
                    e.target.value = ""; // Reset to allow re-selection
                  }}
                />
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload size={32} className="text-indigo-600" />
                </div>
                <p className="text-base font-semibold text-slate-700">
                  {file ? file.name : "Select or drag PDF here"}
                </p>
                <p className="text-xs text-slate-500 mt-2">Maximum file size: 10MB</p>

                {file && !loading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPdfUrl("");
                    }}
                    className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:shadow-md transition-all z-10"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  className="flex-1 px-6 py-3 rounded-[8px] font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="premium-button flex-[2] h-12"
                  onClick={upload}
                  disabled={loading || !file}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Extractions in progress...
                    </span>
                  ) : (
                    "Finalize and Save"
                  )}
                </button>
              </div>
              
              {errorMessage && (
                <p className="mt-4 text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                  <AlertCircle size={14} />
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}