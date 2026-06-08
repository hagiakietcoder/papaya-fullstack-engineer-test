import type { DocumentType, GroundTruthDocument } from '../types/extraction.js';

export interface DocumentDefinition extends GroundTruthDocument {
  title: string;
  html: string;
}

const baseStyles = `
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 24px; color: #1f2937; background: #fff; }
  .doc { max-width: 720px; margin: 0 auto; border: 1px solid #d1d5db; padding: 28px; }
  .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 20px; }
  .hospital { font-size: 1.35rem; font-weight: 700; color: #0f766e; }
  .meta { font-size: 0.85rem; color: #4b5563; text-align: right; }
  h2 { font-size: 1rem; margin: 18px 0 8px; color: #111827; }
  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-top: 8px; }
  th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
  th { background: #f3f4f6; }
  .total-row td { font-weight: 700; }
  .section { margin-bottom: 14px; line-height: 1.5; }
  .label { font-weight: 600; color: #374151; }
  .stamp { margin-top: 24px; font-size: 0.8rem; color: #6b7280; }
`;

function wrapDocument(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="doc">${body}</div>
</body>
</html>`;
}

export const documentDefinitions: DocumentDefinition[] = [
  {
    id: 'receipt-01',
    filename: 'receipt-01-bangkok-outpatient',
    document_type: 'receipt',
    title: 'Outpatient Receipt — Bangkok Hospital',
    fields: {
      hospital_name: 'Bangkok Hospital',
      patient_name: 'Somchai Prasert',
      date: '2024-03-15',
      items: [
        { description: 'General physician consultation', quantity: 1, unit_price: 1500, total: 1500 },
        { description: 'Chest X-ray', quantity: 1, unit_price: 2200, total: 2200 },
        { description: 'Blood test — CBC', quantity: 1, unit_price: 850, total: 850 },
      ],
      grand_total: 4550,
      payment_method: 'Credit Card',
    },
    html: wrapDocument(
      'Outpatient Receipt',
      `
      <div class="header">
        <div class="hospital">Bangkok Hospital</div>
        <div class="meta">Receipt No: BH-OP-2024-03821<br/>Date: 15 Mar 2024</div>
      </div>
      <div class="section"><span class="label">Patient:</span> Somchai Prasert</div>
      <h2>Itemized Charges</h2>
      <table>
        <thead><tr><th>Description</th><th>Qty</th><th>Unit Price (THB)</th><th>Total (THB)</th></tr></thead>
        <tbody>
          <tr><td>General physician consultation</td><td>1</td><td>1,500.00</td><td>1,500.00</td></tr>
          <tr><td>Chest X-ray</td><td>1</td><td>2,200.00</td><td>2,200.00</td></tr>
          <tr><td>Blood test — CBC</td><td>1</td><td>850.00</td><td>850.00</td></tr>
          <tr class="total-row"><td colspan="3">Grand Total</td><td>4,550.00</td></tr>
        </tbody>
      </table>
      <div class="section"><span class="label">Payment Method:</span> Credit Card</div>
      <div class="stamp">Thank you for choosing Bangkok Hospital</div>
    `,
    ),
  },
  {
    id: 'receipt-02',
    filename: 'receipt-02-samitivej-pharmacy',
    document_type: 'receipt',
    title: 'Pharmacy Receipt — Samitivej Hospital',
    fields: {
      hospital_name: 'Samitivej Sukhumvit Hospital',
      patient_name: 'Naree Prasert',
      date: '2024-05-22',
      items: [
        { description: 'Amoxicillin 500mg', quantity: 2, unit_price: 180, total: 360 },
        { description: 'Paracetamol 500mg', quantity: 1, unit_price: 95, total: 95 },
        { description: 'Pharmacy dispensing fee', quantity: 1, unit_price: 120, total: 120 },
      ],
      grand_total: 575,
      payment_method: 'Cash',
    },
    html: wrapDocument(
      'Pharmacy Receipt',
      `
      <div class="header">
        <div class="hospital">Samitivej Sukhumvit Hospital</div>
        <div class="meta">Pharmacy Receipt: SV-PH-88291<br/>Date: 22 May 2024</div>
      </div>
      <div class="section"><span class="label">Patient:</span> Naree Prasert</div>
      <h2>Medications</h2>
      <table>
        <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
        <tbody>
          <tr><td>Amoxicillin 500mg</td><td>2</td><td>180.00</td><td>360.00</td></tr>
          <tr><td>Paracetamol 500mg</td><td>1</td><td>95.00</td><td>95.00</td></tr>
          <tr><td>Pharmacy dispensing fee</td><td>1</td><td>120.00</td><td>120.00</td></tr>
          <tr class="total-row"><td colspan="3">Grand Total (THB)</td><td>575.00</td></tr>
        </tbody>
      </table>
      <div class="section"><span class="label">Payment:</span> Cash</div>
    `,
    ),
  },
  {
    id: 'receipt-03',
    filename: 'receipt-03-phyathai-emergency',
    document_type: 'receipt',
    title: 'Emergency Receipt — Phyathai Hospital',
    fields: {
      hospital_name: 'Phyathai 2 Hospital',
      patient_name: 'Thanawat Prasert',
      date: '2024-08-03',
      items: [
        { description: 'Emergency room visit', quantity: 1, unit_price: 3200, total: 3200 },
        { description: 'Wound dressing', quantity: 1, unit_price: 650, total: 650 },
        { description: 'Tetanus vaccine', quantity: 1, unit_price: 890, total: 890 },
      ],
      grand_total: 4740,
      payment_method: 'Insurance Direct Billing',
    },
    html: wrapDocument(
      'Emergency Receipt',
      `
      <div class="header">
        <div class="hospital">Phyathai 2 Hospital</div>
        <div class="meta">ER Receipt: PT2-ER-11902<br/>03/08/2024</div>
      </div>
      <div class="section"><span class="label">Patient Name:</span> Thanawat Prasert</div>
      <table>
        <thead><tr><th>Service</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
        <tbody>
          <tr><td>Emergency room visit</td><td>1</td><td>3,200.00</td><td>3,200.00</td></tr>
          <tr><td>Wound dressing</td><td>1</td><td>650.00</td><td>650.00</td></tr>
          <tr><td>Tetanus vaccine</td><td>1</td><td>890.00</td><td>890.00</td></tr>
          <tr class="total-row"><td colspan="3">Grand Total</td><td>4,740.00</td></tr>
        </tbody>
      </table>
      <div class="section"><span class="label">Payment Method:</span> Insurance Direct Billing</div>
    `,
    ),
  },
  {
    id: 'discharge-01',
    filename: 'discharge-01-bangkok-pneumonia',
    document_type: 'discharge_summary',
    title: 'Discharge Summary — Bangkok Hospital',
    fields: {
      hospital_name: 'Bangkok Hospital',
      patient_name: 'Somchai Prasert',
      admission_date: '2024-04-02',
      discharge_date: '2024-04-06',
      diagnosis: {
        primary: 'Community-acquired pneumonia',
        secondary: ['Hypertension', 'Type 2 diabetes mellitus'],
      },
      procedures_performed: ['IV antibiotic therapy', 'Chest physiotherapy', 'Oxygen support'],
      attending_physician: 'Dr. Anan Chaiyaporn',
      discharge_instructions:
        'Complete oral antibiotics for 7 days. Follow up in OPD in 2 weeks. Return if fever recurs.',
    },
    html: wrapDocument(
      'Discharge Summary',
      `
      <div class="header">
        <div class="hospital">Bangkok Hospital</div>
        <div class="meta">Discharge Summary<br/>DS-2024-04182</div>
      </div>
      <div class="section"><span class="label">Patient:</span> Somchai Prasert</div>
      <div class="section"><span class="label">Admission Date:</span> 02 Apr 2024</div>
      <div class="section"><span class="label">Discharge Date:</span> 06 Apr 2024</div>
      <h2>Diagnosis</h2>
      <div class="section"><span class="label">Primary:</span> Community-acquired pneumonia</div>
      <div class="section"><span class="label">Secondary:</span> Hypertension; Type 2 diabetes mellitus</div>
      <h2>Procedures Performed</h2>
      <ul><li>IV antibiotic therapy</li><li>Chest physiotherapy</li><li>Oxygen support</li></ul>
      <div class="section"><span class="label">Attending Physician:</span> Dr. Anan Chaiyaporn</div>
      <h2>Discharge Instructions</h2>
      <div class="section">Complete oral antibiotics for 7 days. Follow up in OPD in 2 weeks. Return if fever recurs.</div>
    `,
    ),
  },
  {
    id: 'discharge-02',
    filename: 'discharge-02-samitivej-appendectomy',
    document_type: 'discharge_summary',
    title: 'Discharge Summary — Samitivej Hospital',
    fields: {
      hospital_name: 'Samitivej Sukhumvit Hospital',
      patient_name: 'Pimchanok Prasert',
      admission_date: '2024-06-18',
      discharge_date: '2024-06-21',
      diagnosis: {
        primary: 'Acute appendicitis',
        secondary: [],
      },
      procedures_performed: ['Laparoscopic appendectomy'],
      attending_physician: 'Dr. Siriporn Wattana',
      discharge_instructions:
        'Keep incision dry for 48 hours. No heavy lifting for 2 weeks. Pain medication as prescribed.',
    },
    html: wrapDocument(
      'Discharge Summary',
      `
      <div class="header">
        <div class="hospital">Samitivej Sukhumvit Hospital</div>
        <div class="meta">Summary No: SV-DS-66201</div>
      </div>
      <div class="section"><span class="label">Patient Name:</span> Pimchanok Prasert</div>
      <div class="section"><span class="label">Admission:</span> 18/06/2024 &nbsp; <span class="label">Discharge:</span> 21/06/2024</div>
      <h2>Diagnosis</h2>
      <div class="section">Primary: Acute appendicitis</div>
      <h2>Procedures</h2>
      <div class="section">Laparoscopic appendectomy</div>
      <div class="section"><span class="label">Attending Physician:</span> Dr. Siriporn Wattana</div>
      <h2>Discharge Instructions</h2>
      <div class="section">Keep incision dry for 48 hours. No heavy lifting for 2 weeks. Pain medication as prescribed.</div>
    `,
    ),
  },
  {
    id: 'discharge-03',
    filename: 'discharge-03-phyathai-maternity',
    document_type: 'discharge_summary',
    title: 'Discharge Summary — Phyathai Hospital',
    fields: {
      hospital_name: 'Phyathai 2 Hospital',
      patient_name: 'Naree Prasert',
      admission_date: '2024-09-10',
      discharge_date: '2024-09-13',
      diagnosis: {
        primary: 'Normal spontaneous vaginal delivery',
        secondary: ['Gestational hypertension — resolved'],
      },
      procedures_performed: ['Vaginal delivery', 'Neonatal assessment'],
      attending_physician: 'Dr. Malee Srisuk',
      discharge_instructions:
        'Breastfeeding support provided. Postpartum check-up in 6 weeks. Watch for excessive bleeding.',
    },
    html: wrapDocument(
      'Discharge Summary',
      `
      <div class="header">
        <div class="hospital">Phyathai 2 Hospital — Maternity</div>
        <div class="meta">Date issued: 13 Sep 2024</div>
      </div>
      <div class="section"><span class="label">Patient:</span> Naree Prasert</div>
      <div class="section">Admitted: 10-Sep-2024 | Discharged: 13-Sep-2024</div>
      <h2>Diagnosis</h2>
      <div class="section">Primary diagnosis: Normal spontaneous vaginal delivery</div>
      <div class="section">Secondary: Gestational hypertension — resolved</div>
      <h2>Procedures Performed</h2>
      <ul><li>Vaginal delivery</li><li>Neonatal assessment</li></ul>
      <div class="section"><span class="label">Attending Physician:</span> Dr. Malee Srisuk</div>
      <h2>Discharge Instructions</h2>
      <div class="section">Breastfeeding support provided. Postpartum check-up in 6 weeks. Watch for excessive bleeding.</div>
    `,
    ),
  },
  {
    id: 'lab-01',
    filename: 'lab-01-bangkok-cbc',
    document_type: 'lab_report',
    title: 'Lab Report — Bangkok Hospital',
    fields: {
      lab_name: 'Bangkok Hospital Laboratory',
      patient_name: 'Somchai Prasert',
      date: '2024-03-15',
      tests: [
        { test_name: 'WBC', result: '11.2', unit: '10^3/uL', reference_range: '4.0-11.0', flag: 'high' },
        { test_name: 'RBC', result: '4.85', unit: '10^6/uL', reference_range: '4.5-5.5', flag: 'normal' },
        { test_name: 'Hemoglobin', result: '14.1', unit: 'g/dL', reference_range: '13.0-17.0', flag: 'normal' },
        { test_name: 'Platelet', result: '245', unit: '10^3/uL', reference_range: '150-400', flag: 'normal' },
      ],
    },
    html: wrapDocument(
      'Laboratory Report',
      `
      <div class="header">
        <div class="hospital">Bangkok Hospital Laboratory</div>
        <div class="meta">Report ID: LAB-2024-55201<br/>Collection Date: 15/03/2024</div>
      </div>
      <div class="section"><span class="label">Patient:</span> Somchai Prasert</div>
      <h2>Complete Blood Count (CBC)</h2>
      <table>
        <thead><tr><th>Test</th><th>Result</th><th>Unit</th><th>Reference</th><th>Flag</th></tr></thead>
        <tbody>
          <tr><td>WBC</td><td>11.2</td><td>10^3/uL</td><td>4.0-11.0</td><td>HIGH</td></tr>
          <tr><td>RBC</td><td>4.85</td><td>10^6/uL</td><td>4.5-5.5</td><td>Normal</td></tr>
          <tr><td>Hemoglobin</td><td>14.1</td><td>g/dL</td><td>13.0-17.0</td><td>Normal</td></tr>
          <tr><td>Platelet</td><td>245</td><td>10^3/uL</td><td>150-400</td><td>Normal</td></tr>
        </tbody>
      </table>
    `,
    ),
  },
  {
    id: 'lab-02',
    filename: 'lab-02-samitivej-lipid',
    document_type: 'lab_report',
    title: 'Lab Report — Samitivej Hospital',
    fields: {
      lab_name: 'Samitivej Clinical Laboratory',
      patient_name: 'Naree Prasert',
      date: '2024-07-08',
      tests: [
        { test_name: 'Total Cholesterol', result: '228', unit: 'mg/dL', reference_range: '<200', flag: 'high' },
        { test_name: 'LDL Cholesterol', result: '152', unit: 'mg/dL', reference_range: '<100', flag: 'high' },
        { test_name: 'HDL Cholesterol', result: '48', unit: 'mg/dL', reference_range: '>50', flag: 'low' },
        { test_name: 'Triglycerides', result: '165', unit: 'mg/dL', reference_range: '<150', flag: 'high' },
      ],
    },
    html: wrapDocument(
      'Lipid Panel',
      `
      <div class="header">
        <div class="hospital">Samitivej Clinical Laboratory</div>
        <div class="meta">08 July 2024</div>
      </div>
      <div class="section"><span class="label">Patient Name:</span> Naree Prasert</div>
      <h2>Lipid Panel Results</h2>
      <table>
        <thead><tr><th>Test Name</th><th>Result</th><th>Unit</th><th>Ref Range</th><th>Flag</th></tr></thead>
        <tbody>
          <tr><td>Total Cholesterol</td><td>228</td><td>mg/dL</td><td>&lt;200</td><td>H</td></tr>
          <tr><td>LDL Cholesterol</td><td>152</td><td>mg/dL</td><td>&lt;100</td><td>H</td></tr>
          <tr><td>HDL Cholesterol</td><td>48</td><td>mg/dL</td><td>&gt;50</td><td>L</td></tr>
          <tr><td>Triglycerides</td><td>165</td><td>mg/dL</td><td>&lt;150</td><td>H</td></tr>
        </tbody>
      </table>
    `,
    ),
  },
  {
    id: 'prescription-01',
    filename: 'prescription-01-dr-somchai',
    document_type: 'prescription',
    title: 'Prescription — Dr. Somchai Rattanakul',
    fields: {
      doctor_name: 'Dr. Somchai Rattanakul',
      patient_name: 'Somchai Prasert',
      date: '2024-03-15',
      medications: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: '3 times daily', duration: '7 days', quantity: 21 },
        { name: 'Bromhexine syrup', dosage: '10ml', frequency: '3 times daily', duration: '5 days', quantity: 1 },
      ],
    },
    html: wrapDocument(
      'Medical Prescription',
      `
      <div class="header">
        <div class="hospital">Dr. Somchai Rattanakul — Internal Medicine</div>
        <div class="meta">License: พ.ว. 45201<br/>Date: 15 Mar 2024</div>
      </div>
      <div class="section"><span class="label">Patient:</span> Somchai Prasert</div>
      <h2>Medications Prescribed</h2>
      <table>
        <thead><tr><th>Name</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Qty</th></tr></thead>
        <tbody>
          <tr><td>Amoxicillin</td><td>500mg</td><td>3 times daily</td><td>7 days</td><td>21</td></tr>
          <tr><td>Bromhexine syrup</td><td>10ml</td><td>3 times daily</td><td>5 days</td><td>1</td></tr>
        </tbody>
      </table>
    `,
    ),
  },
  {
    id: 'prescription-02',
    filename: 'prescription-02-dr-naree',
    document_type: 'prescription',
    title: 'Prescription — Dr. Naree Pongpattana',
    fields: {
      doctor_name: 'Dr. Naree Pongpattana',
      patient_name: 'Naree Prasert',
      date: '2024-07-08',
      medications: [
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', duration: '90 days', quantity: 90 },
        { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', duration: '90 days', quantity: 90 },
      ],
    },
    html: wrapDocument(
      'Prescription',
      `
      <div class="header">
        <div class="hospital">Dr. Naree Pongpattana — Cardiology Clinic</div>
        <div class="meta">08/07/2024</div>
      </div>
      <div class="section"><span class="label">Patient Name:</span> Naree Prasert</div>
      <table>
        <thead><tr><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Quantity</th></tr></thead>
        <tbody>
          <tr><td>Atorvastatin</td><td>20mg</td><td>Once daily at night</td><td>90 days</td><td>90</td></tr>
          <tr><td>Aspirin</td><td>81mg</td><td>Once daily</td><td>90 days</td><td>90</td></tr>
        </tbody>
      </table>
    `,
    ),
  },
];

export function getSchemaForType(documentType: DocumentType): string {
  const schemas: Record<DocumentType, string> = {
    receipt: `{
  "hospital_name": { "value": string|null, "confidence": number },
  "patient_name": { "value": string|null, "confidence": number },
  "date": { "value": "YYYY-MM-DD"|null, "confidence": number },
  "items": { "value": [{ "description": string, "quantity": number, "unit_price": number, "total": number }]|null, "confidence": number },
  "grand_total": { "value": number|null, "confidence": number },
  "payment_method": { "value": string|null, "confidence": number }
}`,
    discharge_summary: `{
  "hospital_name": { "value": string|null, "confidence": number },
  "patient_name": { "value": string|null, "confidence": number },
  "admission_date": { "value": "YYYY-MM-DD"|null, "confidence": number },
  "discharge_date": { "value": "YYYY-MM-DD"|null, "confidence": number },
  "diagnosis": { "value": { "primary": string, "secondary": string[] }|null, "confidence": number },
  "procedures_performed": { "value": string[]|null, "confidence": number },
  "attending_physician": { "value": string|null, "confidence": number },
  "discharge_instructions": { "value": string|null, "confidence": number }
}`,
    lab_report: `{
  "lab_name": { "value": string|null, "confidence": number },
  "patient_name": { "value": string|null, "confidence": number },
  "date": { "value": "YYYY-MM-DD"|null, "confidence": number },
  "tests": { "value": [{ "test_name": string, "result": string, "unit": string, "reference_range": string, "flag": "normal"|"high"|"low" }]|null, "confidence": number }
}`,
    prescription: `{
  "doctor_name": { "value": string|null, "confidence": number },
  "patient_name": { "value": string|null, "confidence": number },
  "date": { "value": "YYYY-MM-DD"|null, "confidence": number },
  "medications": { "value": [{ "name": string, "dosage": string, "frequency": string, "duration": string, "quantity": number }]|null, "confidence": number }
}`,
  };

  return schemas[documentType];
}
