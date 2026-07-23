import React, { useState, useEffect } from 'react';
import { 
  Upload, Download, FileSpreadsheet, FileText, CheckCircle2, AlertTriangle, 
  X, Filter, Eye, RefreshCw, FileCheck, Layers, FileDown, Table, AlertCircle, 
  Search, Check, Trash2, ArrowRight, ShieldAlert, Sparkles, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type DataDomain = 'CUSTOMERS' | 'INVENTORY' | 'SALES' | 'EXPENSES' | 'TRANSACTIONS';
export type ImportFileType = 'CSV' | 'EXCEL';
export type ExportFileType = 'CSV' | 'EXCEL' | 'PDF';

export interface ParsedRow {
  rowNumber: number;
  data: Record<string, any>;
  isValid: boolean;
  errors: string[];
}

export interface SampleTemplateData {
  headers: string[];
  sampleRows: Record<string, string>[];
}

export const domainTemplates: Record<DataDomain, SampleTemplateData> = {
  CUSTOMERS: {
    headers: ['Customer ID', 'Full Name', 'Company', 'Email', 'Phone', 'Billing Country'],
    sampleRows: [
      { 'Customer ID': 'CUST-001', 'Full Name': 'Apex Hardware Group', 'Company': 'Apex Ltd', 'Email': 'billing@apex.io', 'Phone': '+1 555-0192', 'Billing Country': 'United States' },
      { 'Customer ID': 'CUST-002', 'Full Name': 'Elena Rostova', 'Company': 'Rostova Audit', 'Email': 'elena@rostova.eu', 'Phone': '+44 20 7946 0912', 'Billing Country': 'United Kingdom' },
      { 'Customer ID': 'CUST-003', 'Full Name': 'Invalid Customer Row', 'Company': '', 'Email': 'invalid-email-format', 'Phone': '', 'Billing Country': 'Japan' }
    ]
  },
  INVENTORY: {
    headers: ['SKU', 'Product Name', 'Category', 'Unit Cost ($)', 'Selling Price ($)', 'Stock Quantity'],
    sampleRows: [
      { 'SKU': 'BOX-INV-5KW', 'Product Name': 'Box Tech 5kW Solar Inverter', 'Category': 'Hardware', 'Unit Cost ($)': '850.00', 'Selling Price ($)': '1250.00', 'Stock Quantity': '42' },
      { 'SKU': 'BOX-BAT-10K', 'Product Name': 'Lithium Battery Storage 10kWh', 'Category': 'Energy Storage', 'Unit Cost ($)': '2100.00', 'Selling Price ($)': '3400.00', 'Stock Quantity': '18' },
      { 'SKU': '', 'Product Name': 'Defective Inverter', 'Category': 'Hardware', 'Unit Cost ($)': '-50.00', 'Selling Price ($)': '0.00', 'Stock Quantity': '-5' }
    ]
  },
  SALES: {
    headers: ['Invoice ID', 'Customer Name', 'Issue Date', 'Amount ($)', 'Tax ($)', 'Status'],
    sampleRows: [
      { 'Invoice ID': 'INV-2026-088', 'Customer Name': 'Apex Hardware Group', 'Issue Date': '2026-07-20', 'Amount ($)': '4500.00', 'Tax ($)': '360.00', 'Status': 'PAID' },
      { 'Invoice ID': 'INV-2026-089', 'Customer Name': 'The Box Clothing Store', 'Issue Date': '2026-07-21', 'Amount ($)': '1280.00', 'Tax ($)': '102.40', 'Status': 'UNPAID' },
      { 'Invoice ID': 'INV-CORRUPT', 'Customer Name': 'Unknown', 'Issue Date': 'invalid-date', 'Amount ($)': 'abc', 'Tax ($)': '0.00', 'Status': 'PENDING' }
    ]
  },
  EXPENSES: {
    headers: ['Expense ID', 'Vendor', 'Category', 'Amount ($)', 'Section 179 Eligible', 'Date'],
    sampleRows: [
      { 'Expense ID': 'EXP-901', 'Vendor': 'Shenzhen Factory Direct', 'Category': 'COGS Hardware', 'Amount ($)': '12400.00', 'Section 179 Eligible': 'Yes', 'Date': '2026-07-15' },
      { 'Expense ID': 'EXP-902', 'Vendor': 'Cloud Server Hosting', 'Category': 'Software & Utilities', 'Amount ($)': '620.00', 'Section 179 Eligible': 'No', 'Date': '2026-07-18' },
      { 'Expense ID': '', 'Vendor': '', 'Category': 'Misc', 'Amount ($)': '-100.00', 'Section 179 Eligible': 'Maybe', 'Date': '2026-99-99' }
    ]
  },
  TRANSACTIONS: {
    headers: ['Transaction ID', 'Type', 'Account', 'Amount ($)', 'Timestamp', 'Reference'],
    sampleRows: [
      { 'Transaction ID': 'TXN-8801', 'Type': 'CREDIT', 'Account': 'Box Tech Operating Bank', 'Amount ($)': '12500.00', 'Timestamp': '2026-07-21 14:20', 'Reference': 'Wire Deposit' },
      { 'Transaction ID': 'TXN-8802', 'Type': 'DEBIT', 'Account': 'Stripe POS Terminal', 'Amount ($)': '340.00', 'Timestamp': '2026-07-22 01:10', 'Reference': 'Terminal Sale #88' },
      { 'Transaction ID': 'TXN-FAIL', 'Type': 'UNKNOWN', 'Account': 'None', 'Amount ($)': '0.00', 'Timestamp': '', 'Reference': '' }
    ]
  }
};

export const DataImportExport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'IMPORT' | 'EXPORT' | 'AUDIT_LOGS'>('IMPORT');
  
  // Import State
  const [selectedDomain, setSelectedDomain] = useState<DataDomain>('CUSTOMERS');
  const [importFileType, setImportFileType] = useState<ImportFileType>('CSV');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [parsedRows, setParsedRows] = useState<ParsedRow[] | null>(null);
  const [filterPreview, setFilterPreview] = useState<'ALL' | 'VALID_ONLY' | 'ERRORS_ONLY'>('ALL');
  
  // Export State
  const [exportDomain, setExportDomain] = useState<DataDomain>('SALES');
  const [exportFileType, setExportFileType] = useState<ExportFileType>('CSV');
  const [exportDateRange, setExportDateRange] = useState<'ALL_TIME' | 'THIS_MONTH' | 'THIS_QUARTER' | 'THIS_YEAR'>('THIS_MONTH');

  // Audit Logs State
  const [importHistory, setImportHistory] = useState<Array<{ id: string; domain: DataDomain; fileName: string; totalRows: number; validRows: number; timestamp: string }>>([
    { id: 'imp-001', domain: 'CUSTOMERS', fileName: 'q2_enterprise_clients.csv', totalRows: 45, validRows: 43, timestamp: '2026-07-21 18:20' },
    { id: 'imp-002', domain: 'INVENTORY', fileName: 'shenzhen_warehouse_hardware_july.xlsx', totalRows: 120, validRows: 120, timestamp: '2026-07-22 02:15' }
  ]);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // Simulate Upload & Parse file validation
  const handleSimulateUpload = (sampleChoice: 'CLEAN' | 'WITH_ERRORS') => {
    setIsUploading(true);
    triggerToast(`⏳ Parsing & validating ${selectedDomain} ${importFileType} file structure...`);

    setTimeout(() => {
      const template = domainTemplates[selectedDomain];
      let rowsToProcess = template.sampleRows;

      if (sampleChoice === 'CLEAN') {
        rowsToProcess = rowsToProcess.filter((_, idx) => idx < 2);
      }

      const rows: ParsedRow[] = rowsToProcess.map((row, index) => {
        const errors: string[] = [];
        const rNum = index + 1;

        // Validation rules per domain
        if (selectedDomain === 'CUSTOMERS') {
          if (!row['Customer ID']) errors.push('Missing required Customer ID');
          if (row['Email'] && !row['Email'].includes('@')) errors.push('Invalid email format (missing @)');
        } else if (selectedDomain === 'INVENTORY') {
          if (!row['SKU']) errors.push('Missing required Product SKU');
          if (parseFloat(row['Unit Cost ($)']) < 0) errors.push('Unit Cost cannot be negative');
        } else if (selectedDomain === 'SALES') {
          if (row['Issue Date'] === 'invalid-date') errors.push('Unrecognized date format');
          if (isNaN(parseFloat(row['Amount ($)']))) errors.push('Amount ($) must be a numeric value');
        } else if (selectedDomain === 'EXPENSES') {
          if (!row['Expense ID']) errors.push('Missing required Expense ID');
          if (parseFloat(row['Amount ($)']) < 0) errors.push('Expense Amount cannot be negative');
        } else if (selectedDomain === 'TRANSACTIONS') {
          if (row['Type'] !== 'CREDIT' && row['Type'] !== 'DEBIT') errors.push('Transaction Type must be CREDIT or DEBIT');
        }

        return {
          rowNumber: rNum,
          data: row,
          isValid: errors.length === 0,
          errors
        };
      });

      setParsedRows(rows);
      setIsUploading(false);
      triggerToast(`✅ File parsed: ${rows.filter(r => r.isValid).length} valid, ${rows.filter(r => !r.isValid).length} flagged errors.`);
    }, 1200);
  };

  // Trigger Import Execution
  const handleExecuteImport = () => {
    if (!parsedRows) return;
    const validCount = parsedRows.filter(r => r.isValid).length;
    
    setImportHistory(prev => [
      {
        id: `imp-${Date.now()}`,
        domain: selectedDomain,
        fileName: `imported_${selectedDomain.toLowerCase()}_${Date.now()}.${importFileType.toLowerCase()}`,
        totalRows: parsedRows.length,
        validRows: validCount,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      },
      ...prev
    ]);

    triggerToast(`🎉 Successfully imported ${validCount} valid ${selectedDomain} records into MintStep Ledger!`);
    setParsedRows(null);
  };

  // Download Error Audit Report CSV
  const handleDownloadErrorReport = () => {
    if (!parsedRows) return;
    const invalidRows = parsedRows.filter(r => !r.isValid);
    if (invalidRows.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,Row_Number,Errors,Raw_Data\n";
    invalidRows.forEach(r => {
      csvContent += `${r.rowNumber},"${r.errors.join('; ')}","${JSON.stringify(r.data).replace(/"/g, '""')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `import_error_report_${selectedDomain.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast("📄 Error Audit Report CSV downloaded!");
  };

  // Export Data File Download
  const handleDownloadExport = () => {
    const template = domainTemplates[exportDomain];
    let fileContent = template.headers.join(",") + "\n";

    template.sampleRows.forEach(row => {
      fileContent += template.headers.map(h => `"${row[h] || ''}"`).join(",") + "\n";
    });

    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mintstep_${exportDomain.toLowerCase()}_export.${exportFileType.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`📥 Generated & Downloaded ${exportDomain} export file in ${exportFileType} format!`);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 p-4 lg:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-cyan-400 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center space-x-2 border border-cyan-300"
          >
            <FileCheck className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <FileSpreadsheet className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">MintStep Universal Data Import & Export Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                CSV & Excel Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">High-speed file parser, schema validation, preview matrix & error report generation for Customers, Inventory & Ledger</p>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center space-x-3">
          <div>
            <span className="text-[10px] text-slate-500 block">Supported Formats:</span>
            <span className="text-cyan-400 font-bold">CSV, XLSX, XLS, PDF</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 block">Validation Engine:</span>
            <span className="text-emerald-400 font-bold">Strict Schema Checks</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        {[
          { id: 'IMPORT', label: 'Import Data (CSV & Excel)', icon: Upload },
          { id: 'EXPORT', label: 'Export Ledger & Documents', icon: Download },
          { id: 'AUDIT_LOGS', label: `Import History & Audit Logs (${importHistory.length})`, icon: Table },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeTab === tab.id 
                ? 'bg-cyan-400 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ------------------- TAB 1: IMPORT MODULE ------------------- */}
      {activeTab === 'IMPORT' && (
        <div className="space-y-6">
          
          {/* Domain & File Type Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-900 rounded-3xl border border-slate-800 text-xs font-mono">
            
            {/* Target Domain */}
            <div>
              <label className="text-slate-400 block mb-1 font-bold uppercase">1. Select Target Data Category:</label>
              <select
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value as DataDomain);
                  setParsedRows(null);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
              >
                <option value="CUSTOMERS">Customers Database</option>
                <option value="INVENTORY">Inventory & Products</option>
                <option value="SALES">Sales & Invoices</option>
                <option value="EXPENSES">Expenses & Section 179</option>
                <option value="TRANSACTIONS">Bank & POS Transactions</option>
              </select>
            </div>

            {/* File Type */}
            <div>
              <label className="text-slate-400 block mb-1 font-bold uppercase">2. Select File Format:</label>
              <select
                value={importFileType}
                onChange={(e) => setImportFileType(e.target.value as ImportFileType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
              >
                <option value="CSV">CSV File (.csv)</option>
                <option value="EXCEL">Excel Workbook (.xlsx, .xls)</option>
              </select>
            </div>

          </div>

          {/* Drag and Drop Upload Dropzone Area */}
          <div className="p-8 bg-slate-900 border-2 border-dashed border-slate-800 hover:border-cyan-400/50 rounded-3xl transition-all text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center mx-auto">
              <Upload className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-100">Upload your {selectedDomain} file</h3>
              <p className="text-xs text-slate-400">Drag and drop your .{importFileType.toLowerCase()} spreadsheet here or test with sample templates</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSimulateUpload('CLEAN')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold cursor-pointer transition-all"
              >
                Load Sample Clean Spreadsheet
              </button>

              <button
                type="button"
                onClick={() => handleSimulateUpload('WITH_ERRORS')}
                className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold cursor-pointer transition-all"
              >
                Load File with Flagged Errors (Test Parser)
              </button>
            </div>
          </div>

          {/* Parsed Rows Preview Table & Error Reporting Matrix */}
          {parsedRows && (
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-100 tracking-wider">File Parsing & Schema Validation Matrix</h3>
                  <p className="text-xs text-slate-400">
                    Total Rows: <span className="font-mono text-slate-200">{parsedRows.length}</span> | 
                    Valid: <span className="font-mono text-emerald-400">{parsedRows.filter(r => r.isValid).length}</span> | 
                    Errors: <span className="font-mono text-rose-400">{parsedRows.filter(r => !r.isValid).length}</span>
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center space-x-2 font-mono text-xs">
                  {(['ALL', 'VALID_ONLY', 'ERRORS_ONLY'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterPreview(f)}
                      className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                        filterPreview === f 
                          ? 'bg-cyan-400 text-slate-950' 
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Summary Banner & Download Button if errors present */}
              {parsedRows.some(r => !r.isValid) && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-rose-400 font-mono">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{parsedRows.filter(r => !r.isValid).length} Rows contain schema or field validation errors.</span>
                  </div>

                  <button
                    onClick={handleDownloadErrorReport}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs font-mono transition-all cursor-pointer shadow-md flex items-center space-x-1.5 shrink-0"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Download Error Audit Report CSV</span>
                  </button>
                </div>
              )}

              {/* Preview Table */}
              <div className="overflow-x-auto font-mono text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase">
                      <th className="p-3">Status</th>
                      <th className="p-3">Row #</th>
                      {domainTemplates[selectedDomain].headers.map(h => (
                        <th key={h} className="p-3">{h}</th>
                      ))}
                      <th className="p-3">Validation Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {parsedRows
                      .filter(r => {
                        if (filterPreview === 'VALID_ONLY') return r.isValid;
                        if (filterPreview === 'ERRORS_ONLY') return !r.isValid;
                        return true;
                      })
                      .map(r => (
                        <tr key={r.rowNumber} className={r.isValid ? 'hover:bg-slate-950/50' : 'bg-rose-500/5 hover:bg-rose-500/10'}>
                          <td className="p-3">
                            {r.isValid ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                                Valid
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-bold border border-rose-500/30">
                                Error
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-bold text-slate-400">{r.rowNumber}</td>
                          {domainTemplates[selectedDomain].headers.map(h => (
                            <td key={h} className="p-3 text-slate-300">{r.data[h] || '-'}</td>
                          ))}
                          <td className="p-3 font-sans text-xs">
                            {r.isValid ? (
                              <span className="text-emerald-400">Ready to insert</span>
                            ) : (
                              <span className="text-rose-400 font-bold">{r.errors.join('; ')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Submit Import Button */}
              <button
                onClick={handleExecuteImport}
                className="w-full py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg font-sans"
              >
                <CheckCircle2 className="w-4 h-4 fill-slate-950" />
                <span>Confirm & Import {parsedRows.filter(r => r.isValid).length} Valid Records to Ledger</span>
              </button>

            </div>
          )}

        </div>
      )}

      {/* ------------------- TAB 2: EXPORT MODULE ------------------- */}
      {activeTab === 'EXPORT' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-100 tracking-wider">Export Ledger & Business Records</h3>
              <p className="text-xs text-slate-400">Download formatted accounting statements, customer directories, and tax audit ledgers in CSV, Excel or PDF.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              
              {/* Category */}
              <div>
                <label className="text-slate-400 block mb-1 font-bold uppercase">Target Category:</label>
                <select
                  value={exportDomain}
                  onChange={(e) => setExportDomain(e.target.value as DataDomain)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
                >
                  <option value="SALES">Sales & Invoices</option>
                  <option value="CUSTOMERS">Customers List</option>
                  <option value="INVENTORY">Inventory Records</option>
                  <option value="EXPENSES">Expenses & Section 179</option>
                  <option value="TRANSACTIONS">General Ledger Transactions</option>
                </select>
              </div>

              {/* Format */}
              <div>
                <label className="text-slate-400 block mb-1 font-bold uppercase">Export Format:</label>
                <select
                  value={exportFileType}
                  onChange={(e) => setExportFileType(e.target.value as ExportFileType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
                >
                  <option value="CSV">Comma Separated Values (.csv)</option>
                  <option value="EXCEL">Microsoft Excel Workbook (.xlsx)</option>
                  <option value="PDF">PDF Statutory Statement (.pdf)</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="text-slate-400 block mb-1 font-bold uppercase">Date Range Filter:</label>
                <select
                  value={exportDateRange}
                  onChange={(e) => setExportDateRange(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
                >
                  <option value="THIS_MONTH">Current Month (July 2026)</option>
                  <option value="THIS_QUARTER">Current Quarter (Q3 2026)</option>
                  <option value="THIS_YEAR">Fiscal Year 2026</option>
                  <option value="ALL_TIME">All-Time Cumulative</option>
                </select>
              </div>

            </div>

            {/* Live Sample Export Data Preview */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Live Export Dataset Preview ({exportDomain}):</span>
              <div className="overflow-x-auto font-mono text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase">
                      {domainTemplates[exportDomain].headers.map(h => (
                        <th key={h} className="p-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {domainTemplates[exportDomain].sampleRows.map((row, idx) => (
                      <tr key={idx}>
                        {domainTemplates[exportDomain].headers.map(h => (
                          <td key={h} className="p-2">{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={handleDownloadExport}
              className="w-full py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Generate & Download {exportDomain} ({exportFileType})</span>
            </button>

          </div>
        </div>
      )}

      {/* ------------------- TAB 3: AUDIT LOGS ------------------- */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase text-slate-200">Historical Import Audit Trail</h3>
            <span className="text-slate-400">{importHistory.length} Recorded Operations</span>
          </div>

          <div className="space-y-3">
            {importHistory.map(item => (
              <div key={item.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-400 font-bold">{item.fileName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">{item.domain}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Timestamp: {item.timestamp}</p>
                </div>

                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{item.validRows} / {item.totalRows} Rows Synced</span>
                  <span className="text-[10px] text-slate-500">100% Audit Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DataImportExport;
