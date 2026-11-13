import { ReportAnalysis } from '../types/report';

export const MOCK_REPORTS: ReportAnalysis[] = [
  {
    id: 'rep-cbc-01',
    report_title: 'Complete Blood Count (CBC) with Differential',
    patient_summary: 'Your Complete Blood Count shows that most of your blood cells are healthy and active. However, your Hemoglobin and Red Blood Cell count are slightly below standard reference ranges. This is a common pattern often associated with mild iron deficiency or low dietary iron, which can cause mild fatigue. Your White Blood Cells and Platelets are completely normal, showing healthy immune defenses and normal blood clotting.',
    overall_status: 'needs_attention',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    key_takeaways: [
      'Hemoglobin is slightly lower than normal (11.2 g/dL), which may explain feelings of lower energy.',
      'White Blood Cells are in a healthy normal range (6,800 /mcL), meaning no active infection signs.',
      'Platelet counts are optimal (245,000 /mcL) for standard blood clotting.'
    ],
    panels: [
      {
        panel_name: 'Red Blood Cell (RBC) & Oxygen Transport Panel',
        metrics: [
          {
            name: 'Hemoglobin (Hb)',
            value: '11.2',
            unit: 'g/dL',
            reference_range: '12.0 - 16.0 g/dL',
            status: 'low',
            simple_explanation: 'Hemoglobin is the oxygen-carrying protein inside your red blood cells. It picks up oxygen in your lungs and carries it to your tissues and muscles.',
            clinical_context: 'When slightly low, less oxygen travels to muscles, which can cause tiredness or mild breathlessness.'
          },
          {
            name: 'RBC Count',
            value: '3.8',
            unit: 'million/mcL',
            reference_range: '4.2 - 5.4 million/mcL',
            status: 'low',
            simple_explanation: 'The actual number of red blood cells in a microliter of blood.',
            clinical_context: 'Follows hemoglobin levels closely and indicates red cell volume.'
          },
          {
            name: 'Hematocrit (PCV)',
            value: '34.2',
            unit: '%',
            reference_range: '36.0 - 46.0 %',
            status: 'low',
            simple_explanation: 'The percentage of your total blood volume that consists of red blood cells.',
            clinical_context: 'A lower percentage indicates your blood has slightly fewer red cells relative to plasma.'
          },
          {
            name: 'MCV (Mean Corpuscular Volume)',
            value: '78.5',
            unit: 'fL',
            reference_range: '80.0 - 100.0 fL',
            status: 'low',
            simple_explanation: 'Measures the physical size of individual red blood cells.',
            clinical_context: 'Smaller-than-average red cells (microcytic) frequently point to low iron stores.'
          }
        ]
      },
      {
        panel_name: 'Immune & Clotting Biomarkers',
        metrics: [
          {
            name: 'Total Leucocytes (WBC)',
            value: '6,800',
            unit: '/mcL',
            reference_range: '4,000 - 11,000 /mcL',
            status: 'normal',
            simple_explanation: 'Your body’s frontline immune soldiers that defend against bacteria and viruses.',
            clinical_context: 'Normal level confirms stable baseline immune system functioning.'
          },
          {
            name: 'Platelet Count',
            value: '245,000',
            unit: '/mcL',
            reference_range: '150,000 - 450,000 /mcL',
            status: 'normal',
            simple_explanation: 'Small cell fragments responsible for clotting cuts and preventing bruises.',
            clinical_context: 'Within healthy range, supporting regular blood coagulation.'
          }
        ]
      }
    ],
    questions_for_doctor: [
      'Could my low hemoglobin be related to dietary iron or vitamin B12 levels?',
      'Would you recommend checking my serum ferritin (iron storage) levels?',
      'Are there any iron-rich foods or supplements you would suggest I incorporate?'
    ],
    lifestyle_diet_tips: [
      'Incorporate iron-rich foods such as spinach, lentils, beans, and lean meats.',
      'Pair plant-based iron foods with Vitamin C (oranges, bell peppers, lemon) to improve absorption.',
      'Avoid drinking strong tea or coffee directly with meals, as tannins can reduce iron uptake.'
    ],
    extracted_text_preview: 'COMPLETE BLOOD COUNT REPORT\nPatient: Demo Patient | Age: 34 | Female\nHb: 11.2 g/dL (12-16) [LOW]\nRBC: 3.8 mil/uL (4.2-5.4) [LOW]\nWBC: 6,800 /uL (4,000-11,000) [NORMAL]\nPlatelets: 245,000 /uL (150,000-450,000) [NORMAL]',
    disclaimer: 'EDUCATIONAL DISCLAIMER: ReportSaathi provides educational explanations only. This report breakdown is NOT a medical diagnosis or clinical prescription. Please consult your physician for individualized medical advice.'
  },
  {
    id: 'rep-lipid-02',
    report_title: 'Fasting Lipid & Cardiovascular Risk Panel',
    patient_summary: 'Your Lipid Profile measures fats and cholesterols in your blood. Your Total Cholesterol and LDL ("bad" cholesterol) are higher than standard preventive targets, while your protective HDL ("good" cholesterol) and Triglycerides are in a healthy range. Moderately elevated LDL is a common biomarker that doctors monitor for cardiovascular health, often manageable through heart-healthy nutrition and active habits.',
    overall_status: 'needs_attention',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    key_takeaways: [
      'LDL Cholesterol is 142 mg/dL (recommended < 100 mg/dL), representing higher circulating particles.',
      'HDL Cholesterol is 52 mg/dL (recommended > 40 mg/dL), which provides healthy protective clearance.',
      'Triglycerides are 128 mg/dL (optimal < 150 mg/dL), indicating good recent sugar and carbohydrate processing.'
    ],
    panels: [
      {
        panel_name: 'Lipid (Cholesterol) Measurements',
        metrics: [
          {
            name: 'Total Cholesterol',
            value: '224',
            unit: 'mg/dL',
            reference_range: '< 200 mg/dL',
            status: 'high',
            simple_explanation: 'The total amount of cholesterol carried across all lipoproteins in your bloodstream.',
            clinical_context: 'Slightly above the desirable 200 mg/dL ceiling; worth discussing preventive lifestyle tweaks.'
          },
          {
            name: 'LDL Cholesterol ("Bad")',
            value: '142',
            unit: 'mg/dL',
            reference_range: '< 100 mg/dL',
            status: 'high',
            simple_explanation: 'Low-Density Lipoprotein transports cholesterol into circulation. Elevated levels can gradually build plaque along arterial walls.',
            clinical_context: 'Primary target for heart-healthy dietary changes like reducing saturated fats.'
          },
          {
            name: 'HDL Cholesterol ("Good")',
            value: '52',
            unit: 'mg/dL',
            reference_range: '> 40 mg/dL',
            status: 'normal',
            simple_explanation: 'High-Density Lipoprotein acts like a scavenger, collecting excess cholesterol and taking it back to the liver for clearance.',
            clinical_context: 'Healthy levels above 40 mg/dL offer a protective cardiovascular benefit.'
          },
          {
            name: 'Serum Triglycerides',
            value: '128',
            unit: 'mg/dL',
            reference_range: '< 150 mg/dL',
            status: 'normal',
            simple_explanation: 'The most common form of stored fat in the body, primarily derived from extra dietary calories.',
            clinical_context: 'Optimal level indicates well-balanced current calorie and carbohydrate burning.'
          }
        ]
      }
    ],
    questions_for_doctor: [
      'What is my overall cardiovascular risk score given my age and these cholesterol levels?',
      'Are dietary changes sufficient to monitor over the next 6 months before considering medications?',
      'Should I have a repeat fasting lipid test in 3 to 6 months?'
    ],
    lifestyle_diet_tips: [
      'Replace saturated fats (butter, fatty meats) with healthy unsaturated fats (olive oil, nuts, avocados).',
      'Increase soluble fiber intake from oats, beans, chia seeds, and berries to help lower LDL absorption.',
      'Engage in 150 minutes of moderate aerobic exercise (brisk walking, cycling) per week.'
    ],
    extracted_text_preview: 'LIPID PROFILE (FASTING 12 HOURS)\nTotal Cholesterol: 224 mg/dL (<200) [HIGH]\nLDL: 142 mg/dL (<100) [HIGH]\nHDL: 52 mg/dL (>40) [NORMAL]\nTriglycerides: 128 mg/dL (<150) [NORMAL]',
    disclaimer: 'EDUCATIONAL DISCLAIMER: ReportSaathi provides educational explanations only. This report breakdown is NOT a medical diagnosis or clinical prescription. Please consult your physician for individualized medical advice.'
  },
  {
    id: 'rep-metabolic-03',
    report_title: 'Metabolic & Kidney Function Health Screening',
    patient_summary: 'Your comprehensive metabolic screening shows healthy baseline kidney function with normal creatinine and filtration rates. Your fasting blood glucose is completely within standard limits (92 mg/dL), indicating your body processes dietary sugars steadily. All electrolyte and waste filtration markers are within standard clinical expectations.',
    overall_status: 'all_clear',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    key_takeaways: [
      'All tested biomarkers are within expected clinical reference ranges.',
      'Fasting Blood Sugar (92 mg/dL) shows healthy glycemic balance.',
      'Kidney filtration markers (Creatinine 0.85 mg/dL) demonstrate strong renal health.'
    ],
    panels: [
      {
        panel_name: 'Glycemic & Metabolic Health',
        metrics: [
          {
            name: 'Fasting Blood Glucose',
            value: '92',
            unit: 'mg/dL',
            reference_range: '70 - 99 mg/dL',
            status: 'normal',
            simple_explanation: 'Measures blood sugar concentration after an overnight fast to check insulin efficiency.',
            clinical_context: 'Ideal range supporting steady daily energy.'
          },
          {
            name: 'HbA1c (3-Month Glycemic Average)',
            value: '5.3',
            unit: '%',
            reference_range: '< 5.7 %',
            status: 'normal',
            simple_explanation: 'Shows your average blood sugar level over the past 90 days.',
            clinical_context: 'Normal level confirms stable long-term blood sugar regulation.'
          }
        ]
      },
      {
        panel_name: 'Renal (Kidney) Filtration Panel',
        metrics: [
          {
            name: 'Serum Creatinine',
            value: '0.85',
            unit: 'mg/dL',
            reference_range: '0.60 - 1.20 mg/dL',
            status: 'normal',
            simple_explanation: 'A natural muscle breakdown waste product filtered out by healthy kidneys.',
            clinical_context: 'Consistent normal values reflect efficient kidney filtration.'
          },
          {
            name: 'Blood Urea Nitrogen (BUN)',
            value: '14',
            unit: 'mg/dL',
            reference_range: '7 - 20 mg/dL',
            status: 'normal',
            simple_explanation: 'Formed when protein breaks down in the liver and excreted through urine.',
            clinical_context: 'Normal level reflects proper hydration and protein metabolism.'
          }
        ]
      }
    ],
    questions_for_doctor: [
      'Based on these normal results, when do you recommend my next routine checkup?',
      'Are there any specific screenings recommended for my age bracket?'
    ],
    lifestyle_diet_tips: [
      'Continue drinking 2-3 liters of clean water daily to support kidney filtration.',
      'Maintain balanced protein intake and regular physical activity.'
    ],
    extracted_text_preview: 'COMPREHENSIVE METABOLIC PANEL\nFasting Glucose: 92 mg/dL (70-99) [NORMAL]\nHbA1c: 5.3% (<5.7%) [NORMAL]\nCreatinine: 0.85 mg/dL (0.6-1.2) [NORMAL]\nBUN: 14 mg/dL (7-20) [NORMAL]',
    disclaimer: 'EDUCATIONAL DISCLAIMER: ReportSaathi provides educational explanations only. This report breakdown is NOT a medical diagnosis or clinical prescription. Please consult your physician for individualized medical advice.'
  }
];
