/**
 * Official Indian Exam Document Specifications Data
 * STRICT RULE: Only contains the 15 user-provided exams. No guessed or external additions.
 */

export const DISCLAIMER_TEXT =
  'Note: Specifications may have changed for the current year. Please confirm on the official exam website before submitting your application.';

export const examSpecs = [
  {
    id: 'neet-ug',
    name: 'NEET UG',
    category: 'Medical Entrance',
    description: 'National Eligibility cum Entrance Test (UG)',
    documents: [
      {
        type: 'Photograph (passport)',
        dimensions: '2.5 × 3.5 cm',
        format: 'JPG',
        fileSize: '10 – 200 KB',
        notes: 'White background required',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Photograph (postcard)',
        dimensions: '4 × 6 inch',
        format: 'JPG',
        fileSize: '10 – 200 KB',
        notes: 'Postcard size photo',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: '2.5 × 3.5 cm',
        format: 'JPG',
        fileSize: '4 – 30 KB',
        notes: 'Signed with black pen',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Left & right thumb impressions',
        dimensions: 'Standard thumb impression',
        format: 'JPG',
        fileSize: '10 – 200 KB',
        notes: 'Clear impression',
        toolRoute: '/tool/image-compress',
      },
    ],
  },
  {
    id: 'jee-main',
    name: 'JEE Main',
    category: 'Engineering Entrance',
    description: 'Joint Entrance Examination (Main)',
    documents: [
      {
        type: 'Photograph',
        dimensions: '3.5 × 4.5 cm',
        format: 'JPG',
        fileSize: '10 – 200 KB',
        notes: 'White background',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: '3.5 × 1.5 cm',
        format: 'JPG',
        fileSize: '10 – 100 KB',
        notes: 'Clear signature on white paper',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Class 10 certificate',
        dimensions: 'Standard A4',
        format: 'PDF',
        fileSize: '50 – 300 KB',
        notes: 'Clear scanned PDF document',
        toolRoute: '/tool/pdf-compress',
      },
    ],
  },
  {
    id: 'cuet-ug',
    name: 'CUET UG',
    category: 'University Entrance',
    description: 'Common University Entrance Test (UG)',
    documents: [
      {
        type: 'Photograph',
        dimensions: '3.5 × 4.5 cm',
        format: 'JPG',
        fileSize: '10 – 200 KB',
        notes: 'White background',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: 'Standard signature',
        format: 'JPG',
        fileSize: '10 – 50 KB',
        notes: 'Clear signature',
        toolRoute: '/tool/image-compress',
      },
      {
        type: 'Category / PwD certificate',
        dimensions: 'Standard A4',
        format: 'PDF',
        fileSize: '50 – 300 KB',
        notes: 'Valid certificate PDF',
        toolRoute: '/tool/pdf-compress',
      },
      {
        type: 'Live Photo Capture',
        dimensions: 'Webcam/Mobile capture',
        format: 'System Capture',
        fileSize: 'N/A',
        notes: 'Live photo capture required at time of application',
      },
    ],
  },
  {
    id: 'upsc-cse',
    name: 'UPSC Civil Services (CSE)',
    category: 'Civil Services',
    description: 'UPSC Civil Services Examination',
    documents: [
      {
        type: 'Photograph',
        dimensions: 'Square (350 × 1000 px)',
        format: 'JPG',
        fileSize: '20 – 300 KB',
        notes: 'White background, face covers 75% of photo',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: '350 × 500 px',
        format: 'JPG',
        fileSize: '20 – 100 KB',
        notes: 'Black ink only',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'ID proof',
        dimensions: 'Standard document',
        format: 'PDF',
        fileSize: '20 – 300 KB',
        notes: 'Aadhaar / Voter ID / Passport PDF',
        toolRoute: '/tool/pdf-compress',
      },
    ],
  },
  {
    id: 'upsc-nda-cds',
    name: 'UPSC NDA / CDS',
    category: 'Defense Entrance',
    description: 'National Defence Academy / Combined Defence Services',
    documents: [
      {
        type: 'Photograph',
        dimensions: '350 × 350 px',
        format: 'JPG',
        fileSize: '20 – 300 KB',
        notes: 'Name and date printed on photo',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: '350 × 500 px',
        format: 'JPG',
        fileSize: '20 – 100 KB',
        notes: 'Triple (signed 3 times, stacked)',
        toolRoute: '/tool/image-resize',
      },
    ],
  },
  {
    id: 'ssc-cgl',
    name: 'SSC CGL',
    category: 'Staff Selection',
    description: 'Combined Graduate Level Examination',
    documents: [
      {
        type: 'Photograph',
        dimensions: 'Live Capture',
        format: 'System Webcam/Mobile',
        fileSize: 'N/A',
        notes: 'Live capture via webcam/mobile, no separate file to prepare',
      },
      {
        type: 'Signature',
        dimensions: '4 × 2 cm',
        format: 'JPG',
        fileSize: '10 – 20 KB',
        notes: 'Cursive handwriting',
        toolRoute: '/tool/image-resize',
      },
    ],
  },
  {
    id: 'ssc-chsl',
    name: 'SSC CHSL',
    category: 'Staff Selection',
    description: 'Combined Higher Secondary Level Examination',
    documents: [
      {
        type: 'Photograph',
        dimensions: 'Live Capture',
        format: 'System Webcam/Mobile',
        fileSize: 'N/A',
        notes: 'Live capture via webcam/mobile',
      },
      {
        type: 'Signature',
        dimensions: '4 × 2 cm',
        format: 'JPG',
        fileSize: '10 – 20 KB',
        notes: 'Clear signature',
        toolRoute: '/tool/image-resize',
      },
    ],
  },
  {
    id: 'ssc-gd',
    name: 'SSC GD Constable',
    category: 'Staff Selection',
    description: 'General Duty Constable Examination',
    documents: [
      {
        type: 'Photograph',
        dimensions: '3.5 × 4.5 cm',
        format: 'JPG',
        fileSize: '20 – 50 KB',
        notes: 'Recent passport photo',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: '4 × 2 cm',
        format: 'JPG',
        fileSize: '10 – 20 KB',
        notes: 'Clear signature',
        toolRoute: '/tool/image-resize',
      },
    ],
  },
  {
    id: 'ibps-po-clerk',
    name: 'IBPS PO / Clerk',
    category: 'Banking Entrance',
    description: 'Institute of Banking Personnel Selection',
    documents: [
      {
        type: 'Photograph',
        dimensions: '200 × 230 px',
        format: 'JPG',
        fileSize: '20 – 50 KB',
        notes: 'White background',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: '140 × 60 px',
        format: 'JPG',
        fileSize: '10 – 20 KB',
        notes: 'Cursive handwriting',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Live Photo',
        dimensions: 'Live Capture',
        format: 'System Capture',
        fileSize: 'N/A',
        notes: 'Separate live photo also required',
      },
    ],
  },
  {
    id: 'rrb-ntpc',
    name: 'RRB NTPC',
    category: 'Railway Entrance',
    description: 'Railway Recruitment Board Non-Technical Popular Categories',
    documents: [
      {
        type: 'Photograph',
        dimensions: '3.5 × 4.5 cm',
        format: 'JPG',
        fileSize: '20 – 100 KB',
        notes: 'Clear passport photo',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: '140 × 60 px',
        format: 'JPG',
        fileSize: '10 – 40 KB',
        notes: 'Running hand signature',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Left thumb impression',
        dimensions: 'Standard impression',
        format: 'JPG',
        fileSize: '10 – 50 KB',
        notes: 'Clear ink impression',
        toolRoute: '/tool/image-compress',
      },
    ],
  },
  {
    id: 'rrb-group-d',
    name: 'RRB Group D',
    category: 'Railway Entrance',
    description: 'Railway Recruitment Board Group D',
    documents: [
      {
        type: 'Photograph',
        dimensions: '3.5 × 4.5 cm',
        format: 'JPG',
        fileSize: '20 – 70 KB',
        notes: 'Taken after notification date',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: '140 × 60 px',
        format: 'JPG',
        fileSize: '10 – 40 KB',
        notes: 'Clear signature',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Left thumb impression',
        dimensions: 'Standard impression',
        format: 'JPG',
        fileSize: '10 – 50 KB',
        notes: 'Left thumb impression required',
        toolRoute: '/tool/image-compress',
      },
    ],
  },
  {
    id: 'gate',
    name: 'GATE',
    category: 'Graduate Entrance',
    description: 'Graduate Aptitude Test in Engineering',
    documents: [
      {
        type: 'Photograph',
        dimensions: '240–480 × 320–640 px (3:4 ratio)',
        format: 'JPG',
        fileSize: '5 – 200 KB',
        notes: 'White background',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: '80–280 × 160–560 px (~2 × 7 cm)',
        format: 'JPG',
        fileSize: '5 – 200 KB',
        notes: 'Clear signature on white paper',
        toolRoute: '/tool/image-resize',
      },
    ],
  },
  {
    id: 'ctet',
    name: 'CTET',
    category: 'Teaching Entrance',
    description: 'Central Teacher Eligibility Test',
    documents: [
      {
        type: 'Photograph',
        dimensions: '3.5 × 4.5 cm',
        format: 'JPG',
        fileSize: '10 – 100 KB',
        notes: 'Recent passport photo',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: '3.5 × 1.5 cm',
        format: 'JPG',
        fileSize: '3 – 30 KB',
        notes: 'Clear signature',
        toolRoute: '/tool/image-resize',
      },
    ],
  },
  {
    id: 'cat',
    name: 'CAT',
    category: 'Management Entrance',
    description: 'Common Admission Test',
    documents: [
      {
        type: 'Photograph',
        dimensions: 'Passport-size (~1200 × 1200 px)',
        format: 'JPG',
        fileSize: 'Standard passport photo size',
        notes: 'Passport-size photo',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: 'Standard signature norms',
        format: 'JPG',
        fileSize: 'Standard passport-signature norms',
        notes: 'Clear signature',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Category certificate (if applicable)',
        dimensions: 'Standard A4',
        format: 'PDF',
        fileSize: 'Standard PDF size',
        notes: 'Valid category certificate',
        toolRoute: '/tool/pdf-compress',
      },
    ],
  },
  {
    id: 'ugc-net',
    name: 'UGC NET',
    category: 'Eligibility Test',
    description: 'University Grants Commission National Eligibility Test',
    documents: [
      {
        type: 'Photograph',
        dimensions: '3.5 × 4.5 cm',
        format: 'JPG',
        fileSize: '10 – 200 KB',
        notes: 'Taken within last 3 months',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'Signature',
        dimensions: 'Standard signature',
        format: 'JPG',
        fileSize: '4 – 30 KB',
        notes: 'Running / cursive signature',
        toolRoute: '/tool/image-resize',
      },
      {
        type: 'PwD / UDID certificate (if applicable)',
        dimensions: 'Standard A4',
        format: 'PDF',
        fileSize: '50 – 300 KB',
        notes: 'Valid PwD / UDID certificate PDF',
        toolRoute: '/tool/pdf-compress',
      },
    ],
  },
];

export function getExamById(id) {
  return examSpecs.find((e) => e.id === id);
}

export function searchExams(query) {
  if (!query) return examSpecs;
  const q = query.toLowerCase();
  return examSpecs.filter(
    (e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
  );
}
