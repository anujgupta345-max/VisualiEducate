import React, { useState } from 'react';
import { Printer, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TaxpayerInfo {
  pan: string;
  aadhaar: string;
  name: string;
  dob: string;
  mobile: string;
  email: string;
  address: string;
  financialYear: string;
  assessmentYear: string;
}

interface TDSRecord {
  id: string;
  slNo: number;
  quarter: string;
  dateOfPayment: string;
  amountPaid: number;
  tdsDeducted: number;
  tdsStatus: string;
  status: string;
  amount: number;
}

interface IncomePart {
  id: string;
  informationCode: string;
  description: string;
  source: string;
  records: TDSRecord[];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultTaxpayer: TaxpayerInfo = {
  pan: 'ABCDE1234F',
  aadhaar: 'XXXX XX 12 34',
  name: 'RAHUL KUMAR SHARMA',
  dob: '15/03/1985',
  mobile: '9876543210',
  email: 'rahul.sharma@gmail.com',
  address: 'FLAT NO. 501, SUNRISE APARTMENTS, LINKING ROAD, BANDRA (WEST), MUMBAI - 400050, MAHARASHTRA',
  financialYear: '2023-24',
  assessmentYear: '2024-25',
};

const defaultParts: IncomePart[] = [
  {
    id: '1',
    informationCode: 'TDS_SAL',
    description: 'Tax Deducted at Source on Salary [Section 192]',
    source: 'ABC TECHNOLOGIES PVT. LTD. (TAN: MUMB12345E)',
    records: [
      { id: 'r1', slNo: 1, quarter: 'Q1', dateOfPayment: '30/06/2023', amountPaid: 350000, tdsDeducted: 35000, tdsStatus: 'TDS (Booked)', status: 'Active', amount: 35000 },
      { id: 'r2', slNo: 2, quarter: 'Q2', dateOfPayment: '30/09/2023', amountPaid: 350000, tdsDeducted: 35000, tdsStatus: 'TDS (Booked)', status: 'Active', amount: 35000 },
      { id: 'r3', slNo: 3, quarter: 'Q3', dateOfPayment: '31/12/2023', amountPaid: 350000, tdsDeducted: 35000, tdsStatus: 'TDS (Booked)', status: 'Active', amount: 35000 },
      { id: 'r4', slNo: 4, quarter: 'Q4', dateOfPayment: '31/03/2024', amountPaid: 350000, tdsDeducted: 35000, tdsStatus: 'TDS (Booked)', status: 'Active', amount: 35000 },
    ],
  },
  {
    id: '2',
    informationCode: 'TDS_INT',
    description: 'Tax Deducted at Source on Interest other than Interest on Securities [Section 194A]',
    source: 'STATE BANK OF INDIA (TAN: MUMB98765B)',
    records: [
      { id: 'r5', slNo: 1, quarter: 'Q1', dateOfPayment: '30/06/2023', amountPaid: 25000, tdsDeducted: 2500, tdsStatus: 'TDS (Booked)', status: 'Active', amount: 2500 },
      { id: 'r6', slNo: 2, quarter: 'Q3', dateOfPayment: '31/12/2023', amountPaid: 25000, tdsDeducted: 2500, tdsStatus: 'TDS (Booked)', status: 'Active', amount: 2500 },
    ],
  },
  {
    id: '3',
    informationCode: 'TDS_DIV',
    description: 'Tax Deducted at Source on Dividend [Section 194]',
    source: 'RELIANCE INDUSTRIES LTD. (TAN: MUMB54321C)',
    records: [
      { id: 'r7', slNo: 1, quarter: 'Q2', dateOfPayment: '15/08/2023', amountPaid: 12000, tdsDeducted: 1200, tdsStatus: 'TDS (Booked)', status: 'Active', amount: 1200 },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(n);
const uid = () => Math.random().toString(36).substr(2, 9);

// ─── HTML Generator (for print popup) ────────────────────────────────────────

function generateAISHtml(t: TaxpayerInfo, parts: IncomePart[]): string {
  const totalTDS = parts.reduce((s, p) => s + p.records.reduce((a, r) => a + r.tdsDeducted, 0), 0);
  const totalGross = parts.reduce((s, p) => s + p.records.reduce((a, r) => a + r.amountPaid, 0), 0);
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const dlDate = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}, ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const itLogo = `<svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="60" width="60" height="7" fill="#FF9933" rx="1"/>
    <rect x="12" y="48" width="48" height="10" fill="#128807"/>
    <rect x="10" y="34" width="52" height="14" rx="3" fill="#C8A200"/>
    <circle cx="22" cy="33" r="7" fill="#B8860B"/>
    <circle cx="50" cy="33" r="7" fill="#B8860B"/>
    <rect x="18" y="14" width="36" height="20" rx="4" fill="#B8860B"/>
    <text x="36" y="12" text-anchor="middle" font-size="6" fill="#1a237e" font-family="Arial" font-weight="bold">सत्यमेव जयते</text>
  </svg>`;

  const insightLogo = `<svg width="90" height="48" viewBox="0 0 90 48" xmlns="http://www.w3.org/2000/svg">
    <polygon points="4,44 18,4 32,44" fill="#E65100" opacity="0.9"/>
    <polygon points="22,44 36,10 50,44" fill="#1565C0" opacity="0.9"/>
    <polygon points="40,44 54,16 68,44" fill="#2E7D32" opacity="0.9"/>
    <polygon points="56,44 70,7 84,44" fill="#6A1B9A" opacity="0.9"/>
    <text x="44" y="58" text-anchor="middle" font-size="13" fill="#0D47A1" font-family="Arial" font-weight="bold">Insight</text>
  </svg>`;

  const sectionHtml = parts.map(part => {
    const pTotal = part.records.reduce((s, r) => s + r.amountPaid, 0);
    const pTDS = part.records.reduce((s, r) => s + r.tdsDeducted, 0);

    const rows = part.records.map((r, i) => `
      <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f8f9fa'}">
        <td style="border:1px solid #ccc;padding:3px 5px;text-align:center;font-size:8pt">${pad(r.slNo)}</td>
        <td style="border:1px solid #ccc;padding:3px 5px;text-align:center;font-size:8pt">${r.quarter}</td>
        <td style="border:1px solid #ccc;padding:3px 5px;text-align:center;font-size:8pt">${r.dateOfPayment}</td>
        <td style="border:1px solid #ccc;padding:3px 5px;text-align:right;font-size:8pt">${fmt(r.amountPaid)}</td>
        <td style="border:1px solid #ccc;padding:3px 5px;text-align:right;font-size:8pt">${fmt(r.tdsDeducted)}</td>
        <td style="border:1px solid #ccc;padding:3px 5px;text-align:center;font-size:8pt">${r.tdsStatus}</td>
        <td style="border:1px solid #ccc;padding:3px 5px;text-align:center;font-size:8pt">${r.status}</td>
        <td style="border:1px solid #ccc;padding:3px 5px;text-align:right;font-weight:bold;font-size:8pt">${fmt(r.amount)}</td>
      </tr>`).join('');

    return `
      <table width="100%" style="border-collapse:collapse">
        <tr style="background:#bdd7ee">
          <td style="border:1px solid #999;padding:3px 7px;font-weight:bold;font-size:8.5pt;width:12%">Information Code</td>
          <td style="border:1px solid #999;padding:3px 7px;font-weight:bold;font-size:8.5pt">Information Description</td>
          <td style="border:1px solid #999;padding:3px 7px;font-weight:bold;font-size:8.5pt;width:28%">Information Source</td>
          <td style="border:1px solid #999;padding:3px 7px;font-weight:bold;font-size:8.5pt;text-align:right;width:12%">Amount (₹)</td>
        </tr>
        <tr>
          <td style="border:1px solid #ccc;padding:3px 7px;font-size:8pt">${part.informationCode}</td>
          <td style="border:1px solid #ccc;padding:3px 7px;font-size:8pt">${part.description}</td>
          <td style="border:1px solid #ccc;padding:3px 7px;font-size:8pt">${part.source}</td>
          <td style="border:1px solid #ccc;padding:3px 7px;text-align:right;font-weight:bold;font-size:8pt">${fmt(pTotal)}</td>
        </tr>
      </table>
      <table width="100%" style="border-collapse:collapse;margin-bottom:12px">
        <thead>
          <tr style="background:#e2e2e2">
            <th style="border:1px solid #999;padding:3px 4px;text-align:center;font-size:7.5pt;width:5%">SL<br>NO</th>
            <th style="border:1px solid #999;padding:3px 4px;text-align:center;font-size:7.5pt;width:7%">QUARTER</th>
            <th style="border:1px solid #999;padding:3px 4px;text-align:center;font-size:7.5pt;width:11%">DATE OF<br>PAYMENT/CREDIT</th>
            <th style="border:1px solid #999;padding:3px 4px;text-align:right;font-size:7.5pt;width:13%">AMOUNT PAID/<br>CREDITED (₹)</th>
            <th style="border:1px solid #999;padding:3px 4px;text-align:right;font-size:7.5pt;width:11%">TDS<br>DEDUCTED (₹)</th>
            <th style="border:1px solid #999;padding:3px 4px;text-align:center;font-size:7.5pt;width:16%">TDS/TCS STATUS</th>
            <th style="border:1px solid #999;padding:3px 4px;text-align:center;font-size:7.5pt;width:9%">STATUS</th>
            <th style="border:1px solid #999;padding:3px 4px;text-align:right;font-size:7.5pt;width:11%">AMOUNT (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background:#d9ead3;font-weight:bold">
            <td colspan="3" style="border:1px solid #ccc;padding:3px 5px;text-align:center;font-size:8pt">TOTAL</td>
            <td style="border:1px solid #ccc;padding:3px 5px;text-align:right;font-size:8pt">${fmt(pTotal)}</td>
            <td style="border:1px solid #ccc;padding:3px 5px;text-align:right;font-size:8pt">${fmt(pTDS)}</td>
            <td colspan="2" style="border:1px solid #ccc;padding:3px 5px"></td>
            <td style="border:1px solid #ccc;padding:3px 5px;text-align:right;font-size:8pt">${fmt(pTDS)}</td>
          </tr>
        </tbody>
      </table>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AIS – ${t.pan} – FY ${t.financialYear}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 10mm 12mm; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #000; background: #fff; }
    @page { size: A4 portrait; margin: 8mm; }
    @media print { body { padding: 0; } }
    h1, h2, h3, p { margin: 0; padding: 0; }
  </style>
</head>
<body>

  <!-- Header -->
  <table width="100%" style="border-collapse:collapse;margin-bottom:6px">
    <tr>
      <td width="16%" style="text-align:center;vertical-align:middle">${itLogo}</td>
      <td style="text-align:center;vertical-align:middle;padding:4px">
        <div style="font-size:16pt;font-weight:bold;color:#1a237e;letter-spacing:.5px">Annual Information Statement (AIS)</div>
        <div style="font-size:9pt;color:#333;margin-top:5px">
          <strong>Form No. 26AS (Annual Information Statement)</strong>
        </div>
        <div style="font-size:9pt;color:#333;margin-top:3px">
          Financial Year: <strong>${t.financialYear}</strong> &emsp; Assessment Year: <strong>${t.assessmentYear}</strong>
        </div>
      </td>
      <td width="16%" style="text-align:center;vertical-align:middle">
        ${insightLogo}
        <div style="font-size:7pt;color:#555;margin-top:2px">e-Filing Portal</div>
        <div style="font-size:7pt;color:#555">Income Tax Dept.</div>
      </td>
    </tr>
  </table>

  <hr style="border:none;border-top:3px solid #1a237e;margin:0 0 10px"/>

  <!-- Part A -->
  <div style="font-size:10pt;font-weight:bold;background:#d9d9d9;padding:4px 8px;margin-bottom:5px;border:1px solid #999">
    Part A: Basic Details of Taxpayer
  </div>
  <table width="100%" style="border-collapse:collapse;border:1px solid #aaa;margin-bottom:14px;font-size:9pt">
    <tr>
      <td style="border:1px solid #ccc;padding:5px 8px;background:#efefef;font-weight:bold;width:26%">Permanent Account Number (PAN)</td>
      <td style="border:1px solid #ccc;padding:5px 8px;width:24%;letter-spacing:1px;font-weight:bold">${t.pan}</td>
      <td style="border:1px solid #ccc;padding:5px 8px;background:#efefef;font-weight:bold;width:26%">Aadhaar Number</td>
      <td style="border:1px solid #ccc;padding:5px 8px;width:24%">${t.aadhaar}</td>
    </tr>
    <tr>
      <td style="border:1px solid #ccc;padding:5px 8px;background:#efefef;font-weight:bold">Name of Assessee</td>
      <td style="border:1px solid #ccc;padding:5px 8px;font-weight:bold" colspan="3">${t.name}</td>
    </tr>
    <tr>
      <td style="border:1px solid #ccc;padding:5px 8px;background:#efefef;font-weight:bold">Date of Birth / Incorporation</td>
      <td style="border:1px solid #ccc;padding:5px 8px">${t.dob}</td>
      <td style="border:1px solid #ccc;padding:5px 8px;background:#efefef;font-weight:bold">Mobile Number</td>
      <td style="border:1px solid #ccc;padding:5px 8px">${t.mobile}</td>
    </tr>
    <tr>
      <td style="border:1px solid #ccc;padding:5px 8px;background:#efefef;font-weight:bold">Email ID</td>
      <td style="border:1px solid #ccc;padding:5px 8px" colspan="3">${t.email}</td>
    </tr>
    <tr>
      <td style="border:1px solid #ccc;padding:5px 8px;background:#efefef;font-weight:bold;vertical-align:top">Address</td>
      <td style="border:1px solid #ccc;padding:5px 8px" colspan="3">${t.address}</td>
    </tr>
  </table>

  <!-- Part B1 -->
  <div style="font-size:10pt;font-weight:bold;background:#d9d9d9;padding:4px 8px;margin-bottom:6px;border:1px solid #999">
    Part B1: Information relating to tax deducted or collected at source
  </div>

  ${sectionHtml}

  <!-- Summary Box -->
  <div style="background:#deeaf1;border:1.5px solid #1a237e;padding:7px 12px;margin-bottom:10px;border-radius:2px;font-size:9pt">
    <strong>Summary — FY ${t.financialYear} &nbsp;|&nbsp; AY ${t.assessmentYear}</strong><br/>
    Total Gross Amount Reported: <strong>₹${fmt(totalGross)}</strong> &emsp;
    Total TDS / TCS Deducted: <strong>₹${fmt(totalTDS)}</strong>
  </div>

  <!-- Note -->
  <div style="font-size:7.5pt;border:1px solid #ccc;padding:5px 9px;background:#fffde7;margin-bottom:8px;line-height:1.55">
    <strong>Note:</strong> The TDS/TCS information as displayed in Form 26AS at TRACES portal and the TDS/TCS as per AIS, for the purpose of
    filing of tax return and for other tax compliance matters, taxpayers are advised to refer to AIS. However, for any discrepancy in information
    reported in AIS, the taxpayer may raise feedback/correction through the AIS feedback mechanism available on the e-Filing portal
    (www.incometax.gov.in). This information is being provided only for information purposes.
  </div>

  <!-- Footer -->
  <hr style="border:none;border-top:1px solid #aaa;margin-bottom:5px"/>
  <table width="100%" style="font-size:7.5pt;color:#444">
    <tr>
      <td>Downloaded: ${dlDate}</td>
      <td style="text-align:center">PAN: ${t.pan}</td>
      <td style="text-align:right">IP Address: 192.168.*.*</td>
    </tr>
    <tr>
      <td colspan="3" style="text-align:center;color:#888;font-size:7pt;padding-top:3px">
        This is a computer-generated statement issued under Section 285BB of the Income Tax Act, 1961. &nbsp;|&nbsp;
        Income Tax Department, Government of India &nbsp;|&nbsp; www.incometax.gov.in
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ─── Live Preview: AIS Document ───────────────────────────────────────────────

const ITLogo: React.FC = () => (
  <svg width="64" height="68" viewBox="0 0 64 68" className="mx-auto">
    <rect x="5" y="56" width="54" height="6" fill="#FF9933" rx="1" />
    <rect x="10" y="44" width="44" height="10" fill="#128807" />
    <rect x="8" y="30" width="48" height="14" rx="3" fill="#C8A200" />
    <circle cx="20" cy="29" r="6" fill="#B8860B" />
    <circle cx="44" cy="29" r="6" fill="#B8860B" />
    <rect x="16" y="12" width="32" height="18" rx="3" fill="#B8860B" />
    <text x="32" y="9" textAnchor="middle" fontSize="5.5" fill="#1a237e" fontFamily="Arial" fontWeight="bold">सत्यमेव जयते</text>
  </svg>
);

const InsightLogo: React.FC = () => (
  <div className="flex flex-col items-center">
    <svg width="80" height="40" viewBox="0 0 80 40">
      <polygon points="2,38 14,2 26,38" fill="#E65100" opacity=".9" />
      <polygon points="18,38 30,8 42,38" fill="#1565C0" opacity=".9" />
      <polygon points="34,38 46,14 58,38" fill="#2E7D32" opacity=".9" />
      <polygon points="50,38 62,5 74,38" fill="#6A1B9A" opacity=".9" />
    </svg>
    <span className="text-[13px] font-bold text-blue-900 -mt-1 tracking-wide">Insight</span>
  </div>
);

const AISDocument: React.FC<{ taxpayer: TaxpayerInfo; parts: IncomePart[] }> = ({ taxpayer, parts }) => {
  const totalTDS = parts.reduce((s, p) => s + p.records.reduce((a, r) => a + r.tdsDeducted, 0), 0);
  const totalGross = parts.reduce((s, p) => s + p.records.reduce((a, r) => a + r.amountPaid, 0), 0);

  const tdStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '4px 7px', fontSize: '8.5pt' };
  const thStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '4px 7px', fontSize: '8.5pt', background: '#efefef', fontWeight: 'bold' };

  return (
    <div
      className="bg-white shadow-2xl"
      style={{ width: '210mm', minHeight: '297mm', padding: '10mm 12mm', fontFamily: 'Arial, sans-serif', fontSize: '10pt', color: '#000', margin: '0 auto' }}
    >
      {/* Header */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6px' }}>
        <tbody>
          <tr>
            <td style={{ width: '16%', textAlign: 'center', verticalAlign: 'middle' }}>
              <ITLogo />
              <div style={{ fontSize: '6pt', color: '#1a237e', fontWeight: 'bold', textAlign: 'center', marginTop: '2px' }}>INCOME TAX<br />DEPARTMENT</div>
            </td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '4px' }}>
              <div style={{ fontSize: '16pt', fontWeight: 'bold', color: '#1a237e' }}>Annual Information Statement (AIS)</div>
              <div style={{ fontSize: '8.5pt', color: '#333', marginTop: '4px' }}>
                <strong>Form No. 26AS (Annual Information Statement)</strong>
              </div>
              <div style={{ fontSize: '9pt', color: '#333', marginTop: '3px' }}>
                Financial Year: <strong>{taxpayer.financialYear}</strong> &nbsp;&nbsp; Assessment Year: <strong>{taxpayer.assessmentYear}</strong>
              </div>
            </td>
            <td style={{ width: '16%', textAlign: 'center', verticalAlign: 'middle' }}>
              <InsightLogo />
              <div style={{ fontSize: '6.5pt', color: '#555', marginTop: '2px' }}>e-Filing Portal</div>
            </td>
          </tr>
        </tbody>
      </table>

      <hr style={{ border: 'none', borderTop: '3px solid #1a237e', margin: '0 0 10px' }} />

      {/* Part A Header */}
      <div style={{ fontSize: '10pt', fontWeight: 'bold', background: '#d9d9d9', padding: '4px 8px', marginBottom: '5px', border: '1px solid #999' }}>
        Part A: Basic Details of Taxpayer
      </div>

      {/* Part A Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #aaa', marginBottom: '14px' }}>
        <tbody>
          <tr>
            <td style={thStyle}>Permanent Account Number (PAN)</td>
            <td style={{ ...tdStyle, letterSpacing: '1px', fontWeight: 'bold' }}>{taxpayer.pan}</td>
            <td style={thStyle}>Aadhaar Number</td>
            <td style={tdStyle}>{taxpayer.aadhaar}</td>
          </tr>
          <tr>
            <td style={thStyle}>Name of Assessee</td>
            <td colSpan={3} style={{ ...tdStyle, fontWeight: 'bold' }}>{taxpayer.name}</td>
          </tr>
          <tr>
            <td style={thStyle}>Date of Birth / Incorporation</td>
            <td style={tdStyle}>{taxpayer.dob}</td>
            <td style={thStyle}>Mobile Number</td>
            <td style={tdStyle}>{taxpayer.mobile}</td>
          </tr>
          <tr>
            <td style={thStyle}>Email ID</td>
            <td colSpan={3} style={tdStyle}>{taxpayer.email}</td>
          </tr>
          <tr>
            <td style={{ ...thStyle, verticalAlign: 'top' }}>Address</td>
            <td colSpan={3} style={tdStyle}>{taxpayer.address}</td>
          </tr>
        </tbody>
      </table>

      {/* Part B1 Header */}
      <div style={{ fontSize: '10pt', fontWeight: 'bold', background: '#d9d9d9', padding: '4px 8px', marginBottom: '6px', border: '1px solid #999' }}>
        Part B1: Information relating to tax deducted or collected at source
      </div>

      {/* Income Sections */}
      {parts.map((part) => {
        const pTotal = part.records.reduce((s, r) => s + r.amountPaid, 0);
        const pTDS = part.records.reduce((s, r) => s + r.tdsDeducted, 0);
        return (
          <div key={part.id} style={{ marginBottom: '10px' }}>
            {/* Section Info Row */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ background: '#bdd7ee' }}>
                  <td style={{ border: '1px solid #999', padding: '3px 7px', fontWeight: 'bold', fontSize: '8.5pt', width: '12%' }}>Information Code</td>
                  <td style={{ border: '1px solid #999', padding: '3px 7px', fontWeight: 'bold', fontSize: '8.5pt' }}>Information Description</td>
                  <td style={{ border: '1px solid #999', padding: '3px 7px', fontWeight: 'bold', fontSize: '8.5pt', width: '28%' }}>Information Source</td>
                  <td style={{ border: '1px solid #999', padding: '3px 7px', fontWeight: 'bold', fontSize: '8.5pt', textAlign: 'right', width: '12%' }}>Amount (₹)</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '3px 7px', fontSize: '8pt' }}>{part.informationCode}</td>
                  <td style={{ border: '1px solid #ccc', padding: '3px 7px', fontSize: '8pt' }}>{part.description}</td>
                  <td style={{ border: '1px solid #ccc', padding: '3px 7px', fontSize: '8pt' }}>{part.source}</td>
                  <td style={{ border: '1px solid #ccc', padding: '3px 7px', fontSize: '8pt', textAlign: 'right', fontWeight: 'bold' }}>{fmt(pTotal)}</td>
                </tr>
              </tbody>
            </table>

            {/* TDS Detail Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e2e2e2' }}>
                  {['SL NO', 'QUARTER', 'DATE OF PAYMENT/ CREDIT', 'AMOUNT PAID/ CREDITED (₹)', 'TDS DEDUCTED (₹)', 'TDS/TCS STATUS', 'STATUS', 'AMOUNT (₹)'].map((h, i) => (
                    <th key={i} style={{ border: '1px solid #999', padding: '3px 4px', fontSize: '7.5pt', textAlign: i >= 3 && i !== 5 && i !== 6 ? 'right' : 'center', width: ['5%', '7%', '11%', '13%', '11%', '16%', '9%', '11%'][i] }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {part.records.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                    <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'center', fontSize: '8pt' }}>{String(r.slNo).padStart(2, '0')}</td>
                    <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'center', fontSize: '8pt' }}>{r.quarter}</td>
                    <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'center', fontSize: '8pt' }}>{r.dateOfPayment}</td>
                    <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right', fontSize: '8pt' }}>{fmt(r.amountPaid)}</td>
                    <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right', fontSize: '8pt' }}>{fmt(r.tdsDeducted)}</td>
                    <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'center', fontSize: '8pt' }}>{r.tdsStatus}</td>
                    <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'center', fontSize: '8pt' }}>{r.status}</td>
                    <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right', fontWeight: 'bold', fontSize: '8pt' }}>{fmt(r.amount)}</td>
                  </tr>
                ))}
                <tr style={{ background: '#d9ead3', fontWeight: 'bold' }}>
                  <td colSpan={3} style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'center', fontSize: '8pt' }}>TOTAL</td>
                  <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right', fontSize: '8pt' }}>{fmt(pTotal)}</td>
                  <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right', fontSize: '8pt' }}>{fmt(pTDS)}</td>
                  <td colSpan={2} style={{ border: '1px solid #ccc', padding: '3px 5px' }} />
                  <td style={{ border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right', fontSize: '8pt' }}>{fmt(pTDS)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Summary */}
      <div style={{ background: '#deeaf1', border: '1.5px solid #1a237e', padding: '7px 12px', marginBottom: '10px', borderRadius: '2px', fontSize: '9pt' }}>
        <strong>Summary — FY {taxpayer.financialYear} &nbsp;|&nbsp; AY {taxpayer.assessmentYear}</strong><br />
        Total Gross Amount Reported: <strong>₹{fmt(totalGross)}</strong> &emsp; Total TDS / TCS Deducted: <strong>₹{fmt(totalTDS)}</strong>
      </div>

      {/* Note */}
      <div style={{ fontSize: '7.5pt', border: '1px solid #ccc', padding: '5px 9px', background: '#fffde7', marginBottom: '8px', lineHeight: '1.55' }}>
        <strong>Note:</strong> The TDS/TCS information as displayed in Form 26AS at TRACES portal and the TDS/TCS as per AIS, for the purpose of filing of tax return and for other tax compliance matters, taxpayers are advised to refer to AIS. However, for any discrepancy in information reported in AIS, the taxpayer may raise feedback/correction through the AIS feedback mechanism available on the e-Filing portal (www.incometax.gov.in). This information is being provided only for information purposes.
      </div>

      {/* Footer */}
      <hr style={{ border: 'none', borderTop: '1px solid #aaa', marginBottom: '5px' }} />
      <table style={{ width: '100%', fontSize: '7.5pt', color: '#444' }}>
        <tbody>
          <tr>
            <td>Downloaded: {new Date().toLocaleString('en-IN')}</td>
            <td style={{ textAlign: 'center' }}>PAN: {taxpayer.pan}</td>
            <td style={{ textAlign: 'right' }}>IP Address: 192.168.*.*</td>
          </tr>
          <tr>
            <td colSpan={3} style={{ textAlign: 'center', color: '#888', fontSize: '7pt', paddingTop: '3px' }}>
              This is a computer-generated statement issued under Section 285BB of the Income Tax Act, 1961. | Income Tax Department, Government of India | www.incometax.gov.in
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ─── Part Editor Sub-Component ───────────────────────────────────────────────

interface PartEditorProps {
  part: IncomePart;
  onUpdate: (field: keyof IncomePart, value: any) => void;
  onRemove: () => void;
  onAddRecord: () => void;
  onUpdateRecord: (rId: string, field: keyof TDSRecord, value: any) => void;
  onRemoveRecord: (rId: string) => void;
}

const PartEditor: React.FC<PartEditorProps> = ({ part, onUpdate, onRemove, onAddRecord, onUpdateRecord, onRemoveRecord }) => {
  const [open, setOpen] = useState(true);
  const totalAmt = part.records.reduce((s, r) => s + r.amountPaid, 0);
  const totalTDS = part.records.reduce((s, r) => s + r.tdsDeducted, 0);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-2 bg-blue-50 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-blue-900 truncate">{part.informationCode}</p>
          <p className="text-[10px] text-blue-600 truncate">{part.description}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <span className="text-[10px] text-gray-500">₹{fmt(totalAmt)}</span>
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-red-400 hover:text-red-600 p-1">
            <Trash2 size={12} />
          </button>
          {open ? <ChevronLeft size={14} className="text-gray-400 rotate-90" /> : <ChevronRight size={14} className="text-gray-400 rotate-90" />}
        </div>
      </div>

      {open && (
        <div className="p-3 space-y-2">
          {[
            { field: 'informationCode', label: 'Info Code' },
            { field: 'description', label: 'Description' },
            { field: 'source', label: 'Source (Deductor Name + TAN)' },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">{label}</label>
              <input
                type="text"
                value={part[field as keyof IncomePart] as string}
                onChange={e => onUpdate(field as keyof IncomePart, e.target.value)}
                className="w-full border border-gray-200 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-blue-400"
              />
            </div>
          ))}

          {/* Records */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">TDS Records</p>
              <span className="text-[10px] text-gray-400">TDS: ₹{fmt(totalTDS)}</span>
            </div>

            {part.records.map((rec) => (
              <div key={rec.id} className="border border-gray-100 rounded p-2 mb-2 bg-gray-50 space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { field: 'quarter', label: 'Quarter', placeholder: 'Q1' },
                    { field: 'dateOfPayment', label: 'Date (DD/MM/YYYY)', placeholder: '30/06/2023' },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field}>
                      <label className="block text-[9px] font-semibold text-gray-500 mb-0.5">{label}</label>
                      <input
                        type="text"
                        value={rec[field as keyof TDSRecord] as string}
                        onChange={e => onUpdateRecord(rec.id, field as keyof TDSRecord, e.target.value)}
                        className="w-full border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-blue-400"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                  {[
                    { field: 'amountPaid', label: 'Amount Paid (₹)' },
                    { field: 'tdsDeducted', label: 'TDS Deducted (₹)' },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-[9px] font-semibold text-gray-500 mb-0.5">{label}</label>
                      <input
                        type="number"
                        value={rec[field as keyof TDSRecord] as number}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          onUpdateRecord(rec.id, field as keyof TDSRecord, val);
                          if (field === 'tdsDeducted') onUpdateRecord(rec.id, 'amount', val);
                        }}
                        className="w-full border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="block text-[9px] font-semibold text-gray-500 mb-0.5">TDS/TCS Status</label>
                    <select
                      value={rec.tdsStatus}
                      onChange={e => onUpdateRecord(rec.id, 'tdsStatus', e.target.value)}
                      className="w-full border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-blue-400"
                    >
                      <option>TDS (Booked)</option>
                      <option>TDS (Pending)</option>
                      <option>TCS (Booked)</option>
                      <option>TCS (Pending)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-gray-500 mb-0.5">Status</label>
                    <select
                      value={rec.status}
                      onChange={e => onUpdateRecord(rec.id, 'status', e.target.value)}
                      className="w-full border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-blue-400"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => onRemoveRecord(rec.id)} className="text-[10px] text-red-400 hover:text-red-600 flex items-center gap-1">
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={onAddRecord}
              className="w-full flex items-center justify-center gap-1 text-[10px] text-blue-600 border border-dashed border-blue-300 rounded py-1.5 hover:bg-blue-50 transition"
            >
              <Plus size={11} /> Add Quarter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AISGenerator: React.FC = () => {
  const [taxpayer, setTaxpayer] = useState<TaxpayerInfo>(defaultTaxpayer);
  const [parts, setParts] = useState<IncomePart[]>(defaultParts);
  const [formOpen, setFormOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'taxpayer' | 'income'>('taxpayer');

  const updateTaxpayer = (field: keyof TaxpayerInfo, value: string) => {
    setTaxpayer(prev => ({ ...prev, [field]: value }));
  };

  const addPart = () => {
    setParts(prev => [...prev, {
      id: uid(),
      informationCode: 'TDS_NEW',
      description: 'New TDS / Income Entry',
      source: '',
      records: [{ id: uid(), slNo: 1, quarter: 'Q1', dateOfPayment: '', amountPaid: 0, tdsDeducted: 0, tdsStatus: 'TDS (Booked)', status: 'Active', amount: 0 }],
    }]);
  };

  const removePart = (id: string) => setParts(prev => prev.filter(p => p.id !== id));

  const updatePart = (id: string, field: keyof IncomePart, value: any) =>
    setParts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));

  const addRecord = (partId: string) =>
    setParts(prev => prev.map(p => {
      if (p.id !== partId) return p;
      const slNo = p.records.length + 1;
      return { ...p, records: [...p.records, { id: uid(), slNo, quarter: 'Q1', dateOfPayment: '', amountPaid: 0, tdsDeducted: 0, tdsStatus: 'TDS (Booked)', status: 'Active', amount: 0 }] };
    }));

  const updateRecord = (partId: string, rId: string, field: keyof TDSRecord, value: any) =>
    setParts(prev => prev.map(p => p.id !== partId ? p : {
      ...p, records: p.records.map(r => r.id !== rId ? r : { ...r, [field]: value })
    }));

  const removeRecord = (partId: string, rId: string) =>
    setParts(prev => prev.map(p => p.id !== partId ? p : {
      ...p, records: p.records.filter(r => r.id !== rId).map((r, i) => ({ ...r, slNo: i + 1 }))
    }));

  const handleDownloadPDF = () => {
    const html = generateAISHtml(taxpayer, parts);
    const win = window.open('', '_blank', 'width=960,height=750');
    if (!win) { alert('Please allow pop-ups to download the PDF.'); return; }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 700);
  };

  const totalTDS = parts.reduce((s, p) => s + p.records.reduce((a, r) => a + r.tdsDeducted, 0), 0);

  const inputCls = 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 transition';
  const labelCls = 'block text-[11px] font-semibold text-gray-600 mb-1';

  return (
    <div className="flex h-full overflow-hidden bg-gray-100">

      {/* ── Left Form Panel ── */}
      <div className={`bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300 ${formOpen ? 'w-[360px]' : 'w-10'}`}>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="flex items-center justify-between px-3 py-3 bg-[#1a237e] text-white text-xs font-semibold hover:bg-blue-900 transition shrink-0"
        >
          {formOpen ? (
            <>
              <span>Edit AIS Data</span>
              <ChevronLeft size={15} />
            </>
          ) : (
            <ChevronRight size={15} className="mx-auto" />
          )}
        </button>

        {formOpen && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 shrink-0">
              {(['taxpayer', 'income'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-[11px] font-semibold capitalize transition ${activeTab === tab ? 'bg-blue-50 text-blue-800 border-b-2 border-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab === 'taxpayer' ? 'Taxpayer Details' : `Income / TDS (${parts.length})`}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">

              {/* ── Taxpayer Tab ── */}
              {activeTab === 'taxpayer' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { field: 'financialYear', label: 'Financial Year', placeholder: '2023-24' },
                      { field: 'assessmentYear', label: 'Assessment Year', placeholder: '2024-25' },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label className={labelCls}>{label}</label>
                        <input type="text" value={taxpayer[field as keyof TaxpayerInfo]} onChange={e => updateTaxpayer(field as keyof TaxpayerInfo, e.target.value)} className={inputCls} placeholder={placeholder} />
                      </div>
                    ))}
                  </div>
                  {[
                    { field: 'pan', label: 'PAN', placeholder: 'ABCDE1234F' },
                    { field: 'aadhaar', label: 'Aadhaar (Masked)', placeholder: 'XXXX XX 12 34' },
                    { field: 'name', label: 'Full Name (as per PAN)', placeholder: 'RAHUL KUMAR SHARMA' },
                    { field: 'dob', label: 'Date of Birth (DD/MM/YYYY)', placeholder: '15/03/1985' },
                    { field: 'mobile', label: 'Mobile Number', placeholder: '9876543210' },
                    { field: 'email', label: 'Email ID', placeholder: 'email@example.com' },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field}>
                      <label className={labelCls}>{label}</label>
                      <input type="text" value={taxpayer[field as keyof TaxpayerInfo]} onChange={e => updateTaxpayer(field as keyof TaxpayerInfo, e.target.value)} className={inputCls} placeholder={placeholder} />
                    </div>
                  ))}
                  <div>
                    <label className={labelCls}>Address</label>
                    <textarea
                      value={taxpayer.address}
                      onChange={e => updateTaxpayer('address', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ── Income / TDS Tab ── */}
              {activeTab === 'income' && (
                <div className="space-y-3">
                  {parts.map(part => (
                    <PartEditor
                      key={part.id}
                      part={part}
                      onUpdate={(field, value) => updatePart(part.id, field, value)}
                      onRemove={() => removePart(part.id)}
                      onAddRecord={() => addRecord(part.id)}
                      onUpdateRecord={(rId, field, value) => updateRecord(part.id, rId, field, value)}
                      onRemoveRecord={rId => removeRecord(part.id, rId)}
                    />
                  ))}
                  <button
                    onClick={addPart}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 rounded-lg py-3 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition"
                  >
                    <Plus size={14} /> Add Income / TDS Section
                  </button>
                </div>
              )}

            </div>
          </>
        )}
      </div>

      {/* ── Right Preview Panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Preview Toolbar */}
        <div className="bg-[#1a237e] text-white px-6 py-3 flex items-center justify-between shrink-0 shadow-md">
          <div>
            <h2 className="text-sm font-bold tracking-wide">AIS Preview — FY {taxpayer.financialYear}</h2>
            <p className="text-xs text-blue-200 mt-0.5">
              {taxpayer.name} &nbsp;|&nbsp; PAN: {taxpayer.pan} &nbsp;|&nbsp; Total TDS: ₹{fmt(totalTDS)}
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-white text-[#1a237e] px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition shadow-lg"
          >
            <Printer size={14} />
            Download / Print PDF
          </button>
        </div>

        {/* AIS Document Preview */}
        <div className="flex-1 overflow-auto bg-gray-400 p-6">
          <AISDocument taxpayer={taxpayer} parts={parts} />
        </div>

      </div>
    </div>
  );
};

export default AISGenerator;
