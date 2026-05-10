
import { GoogleGenAI } from "@google/genai";
import { DailyBriefing, VisaNewsItem } from "../types";

export const COUNTRY_FLAGS: Record<string, string> = {
  USA: '🇺🇸', UK: '🇬🇧', Canada: '🇨🇦', Australia: '🇦🇺',
  Germany: '🇩🇪', France: '🇫🇷', Netherlands: '🇳🇱',
  'New Zealand': '🇳🇿', Singapore: '🇸🇬', UAE: '🇦🇪', Other: '🌍',
};

export const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  'student-visa':    { label: 'Student Visa',   icon: '🎓' },
  'work-visa':       { label: 'Work Visa',       icon: '💼' },
  'family-visa':     { label: 'Family Visa',     icon: '👨‍👩‍👧' },
  'embassy-update':  { label: 'Embassy Update',  icon: '🏛️' },
  'slot-availability':{ label: 'Slot Status',    icon: '📅' },
  'policy-change':   { label: 'Policy Change',   icon: '⚖️' },
  'community-story': { label: 'Community',       icon: '💬' },
  'success-story':   { label: 'Success Story',   icon: '✅' },
};

export const SOURCE_META: Record<string, { label: string; color: string }> = {
  reddit:   { label: 'Reddit',    color: 'bg-orange-100 text-orange-700' },
  official: { label: 'Official',  color: 'bg-blue-100 text-blue-700' },
  news:     { label: 'News',      color: 'bg-slate-100 text-slate-700' },
  embassy:  { label: 'Embassy',   color: 'bg-indigo-100 text-indigo-700' },
  social:   { label: 'Social',    color: 'bg-pink-100 text-pink-700' },
};

export const SEVERITY_CONFIG: Record<string, { border: string; badge: string; label: string }> = {
  critical:  { border: 'border-l-red-500',    badge: 'bg-red-100 text-red-700',    label: '🔴 Critical' },
  important: { border: 'border-l-amber-500',  badge: 'bg-amber-100 text-amber-700', label: '🟡 Important' },
  info:      { border: 'border-l-blue-400',   badge: 'bg-blue-100 text-blue-700',   label: '🔵 Info' },
  positive:  { border: 'border-l-emerald-500',badge: 'bg-emerald-100 text-emerald-700', label: '🟢 Positive' },
};

function getMockBriefing(today: string): DailyBriefing {
  const news: VisaNewsItem[] = [
    {
      id: 'sv1',
      title: 'F1 Visa Rejection Rate for Indian CS Students Hits Record 38% in 2026',
      summary: 'Consular officers at US embassies in India are increasingly citing "immigrant intent" under INA 214(b) to deny F1 visas to Indian computer science and engineering students. Families who have already paid semester fees face devastating financial losses averaging ₹40–80 lakh.',
      category: 'student-visa', country: 'USA', source: 'r/f1visa', sourceType: 'reddit',
      severity: 'critical', tags: ['F1', '214b', 'CS students', 'rejection'],
      affectedGroup: 'Indian undergraduate & graduate CS applicants',
      actionRequired: 'Strengthen ties-to-India evidence: property, family business documents, return employment offers. Book early morning slots at Hyderabad consulate which has slightly lower refusal rates.',
    },
    {
      id: 'sv2',
      title: 'OPT Gap Leaves 12,000+ Indian Graduates in Visa Limbo After STEM Extensions Delayed',
      summary: 'USCIS processing delays for STEM OPT extensions have ballooned to 5–7 months, creating an employment gap for Indian graduates transitioning from F1 to work authorization. Companies are rescinding job offers citing work-authorization uncertainty.',
      category: 'student-visa', country: 'USA', source: 'USCIS.gov', sourceType: 'official',
      severity: 'critical', tags: ['OPT', 'STEM extension', 'employment gap', 'F1'],
      affectedGroup: 'Indian STEM graduates on F1 OPT',
      actionRequired: 'File STEM OPT extension 90 days before core OPT expiry. Use cap-gap provisions if H1B petition is filed. Consult immigration attorney if employer withdraws offer.',
    },
    {
      id: 'sv3',
      title: 'Indian Parent Shares Heartbreaking Loss: "Sold Our Flat to Fund Son\'s US Studies, Now Visa Denied Twice"',
      summary: 'A Reddit post by user u/visahelp_india has garnered 4,200 upvotes after sharing how their family liquidated a ₹65 lakh apartment to fund their son\'s Master\'s program, only to face two consecutive F1 denials. The post has sparked a national conversation about the financial risks of US education.',
      category: 'community-story', country: 'USA', source: 'r/india', sourceType: 'reddit',
      severity: 'important', tags: ['family savings', 'F1 denial', 'financial risk'],
      affectedGroup: 'Indian middle-class families funding US education',
      actionRequired: 'Consider education loan disbursement AFTER visa approval. Explore universities in Canada or Germany with higher F1/study permit approval rates.',
    },
    {
      id: 'sv4',
      title: 'UK Student Visa Processing Delays Hit 18 Weeks, Endangering September 2026 Intake',
      summary: 'UK Visas and Immigration (UKVI) is experiencing severe backlogs with Indian student visa applications. Applicants who applied in March for September enrollment are still awaiting decisions, and several universities have issued warnings about deferred enrollment.',
      category: 'student-visa', country: 'UK', source: 'UKVI Official', sourceType: 'embassy',
      severity: 'important', tags: ['UK Student visa', 'UKVI', 'September intake', 'backlog'],
      affectedGroup: 'Indian students enrolling in UK universities for 2026 intake',
      actionRequired: 'Apply immediately if you have an unconditional offer. Consider priority visa service (£500 extra) for guaranteed 5 business day decision. Contact your university Student Services for deferral options.',
    },
    {
      id: 'wv1',
      title: 'H1B Lottery 2027: USCIS Reports 5.3x Oversubscription — Only 1 in 5 Indians Selected',
      summary: 'USCIS has announced that for FY2027, there were 470,000+ registrations for just 85,000 H1B cap slots. Indian nationals, who make up approximately 72% of H1B holders, face the steepest odds. Masters cap exhausted on Day 1 of the electronic registration period.',
      category: 'work-visa', country: 'USA', source: 'USCIS.gov', sourceType: 'official',
      severity: 'critical', tags: ['H1B', 'cap', 'lottery', 'FY2027'],
      affectedGroup: 'Indian tech professionals on F1 OPT/CPT seeking H1B',
      actionRequired: 'Explore O1-A (extraordinary ability) as an alternative. If on OPT, cap-gap protects you until Sept 30. Consider L1 transfer if working for multinational. Consult attorney about EB-1C green card direct filing.',
    },
    {
      id: 'wv2',
      title: 'H4-EAD Processing Collapses to 24+ Months — 280,000 Indians Stuck Without Work Authorization',
      summary: 'USCIS H4 EAD (Employment Authorization Document) processing times have reached an all-time high of 24–28 months at the Texas Service Center. This affects Indian spouses of H1B holders who are legally present in the US but cannot work while awaiting EAD renewal.',
      category: 'work-visa', country: 'USA', source: 'USCIS Processing Times', sourceType: 'official',
      severity: 'critical', tags: ['H4 EAD', 'H4', 'processing delay', 'spouses'],
      affectedGroup: 'Indian spouses of H1B holders on H4 status',
      actionRequired: 'File H4 EAD renewal 6 months before current EAD expires. Consider premium processing if available. Advocate through your HR/employer for Congressional inquiry. Follow r/h4ead for latest status updates.',
    },
    {
      id: 'wv3',
      title: 'UK Raises Skilled Worker Visa Salary Threshold to £38,700 — Thousands of Indian IT Roles Eliminated',
      summary: 'The UK Home Office\'s April 2025 increase of the Skilled Worker visa minimum salary to £38,700 (up from £26,200) has made a large portion of entry-level Indian IT professionals ineligible for the route. Many existing visa holders face challenges when switching employers.',
      category: 'work-visa', country: 'UK', source: 'UK Home Office', sourceType: 'official',
      severity: 'important', tags: ['UK Skilled Worker', 'salary threshold', 'IT professionals'],
      affectedGroup: 'Indian IT professionals seeking UK Skilled Worker visa',
      actionRequired: 'Check if your SOC code qualifies for shortage occupation list (£30,960 threshold). Explore Global Talent visa if you have significant achievements. Graduate route (2 years post-study work) is unaffected.',
    },
    {
      id: 'fv1',
      title: 'Survey: 68% of Indian H1B Workers Have Spouse/Family Stuck in India Due to Visa Backlog',
      summary: 'A survey by Indian-American advocacy group Immigration Voice reveals that nearly 7 in 10 Indian H1B workers are separated from immediate family members due to H4 visa appointment unavailability in India combined with backlogs. Average separation duration: 14 months.',
      category: 'family-visa', country: 'USA', source: 'Immigration Voice', sourceType: 'news',
      severity: 'critical', tags: ['family separation', 'H4', 'spouse visa', 'Indian workers'],
      affectedGroup: 'Indian H1B workers with family in India',
      actionRequired: 'Apply for H4 at US consulate in any country where spouse is visiting (Canada, UAE slots are faster). File USCIS cases early. Contact local Congressman for expedite consideration on humanitarian grounds.',
    },
    {
      id: 'fv2',
      title: 'US Consulate India: B1/B2 Visitor Visa Denial Rate for Indian Parents Visiting US Children Rises to 52%',
      summary: 'Consular data analysis shows Indian parents seeking visitor visas to see their children living in the US face a 52% refusal rate, up from 34% in 2023. Officers frequently cite "immigrant intent" despite strong home-country ties and US citizen/resident children as hosts.',
      category: 'family-visa', country: 'USA', source: 'Consular Data Analysis - Times of India', sourceType: 'news',
      severity: 'important', tags: ['B1/B2', 'visitor visa', 'parents', 'family visit'],
      affectedGroup: 'Indian parents of US residents/citizens',
      actionRequired: 'Build a robust I-134/financial support package. Show property ownership, pension, strong family ties in India. Avoid mentioning medical reasons (triggers inadmissibility concerns). Prepare for follow-up questions on applicant\'s US contacts.',
    },
    {
      id: 'fv3',
      title: 'UK Spouse Visa Income Threshold: Indian Families Struggle with New £29,000 Requirement',
      summary: 'The UK spouse visa income threshold rose to £29,000 for new applicants in April 2025, making it harder for Indian nationals in entry-level UK jobs to bring their spouse from India. Couples report being stuck in "indefinite limbo" with no path to family reunification.',
      category: 'family-visa', country: 'UK', source: 'r/ukvisa', sourceType: 'reddit',
      severity: 'important', tags: ['UK spouse visa', 'income threshold', 'family reunion'],
      affectedGroup: 'Indian nationals with UK visa/ILR sponsoring spouses',
      actionRequired: 'Combine savings (£16,000 threshold saves the same as £29,000 income), rental income, and employment income. Explore partner\'s independent visa route (Graduate visa or Skilled Worker). Seek legal advice from OISC-registered adviser.',
    },
    {
      id: 'ea1',
      title: 'VFS India: US Visa Appointments Unavailable Across All 5 Indian Cities — 90+ Day Wait',
      summary: 'VFS Global has confirmed that routine US non-immigrant visa appointment slots are fully booked at all 5 US Consulate locations in India (New Delhi, Mumbai, Chennai, Kolkata, Hyderabad) for the next 90+ days. Emergency/urgent appointment requests are only being accepted for documented medical emergencies.',
      category: 'slot-availability', country: 'USA', source: 'VFS Global India', sourceType: 'embassy',
      severity: 'critical', tags: ['VFS', 'appointment slots', 'US visa', 'India consulates'],
      affectedGroup: 'All Indian US visa applicants',
      actionRequired: 'Monitor ustraveldocs.com daily at 8am and 8pm IST for cancellation slots. Enable third-party slot notification services. Consider applying at third-country consulate (Canada, UAE) with valid Schengen/UK visa. Dropbox renewal may be available if previously issued same visa.',
    },
    {
      id: 'ea2',
      title: 'US Embassy New Delhi Opens Emergency Appointment Window for F1 Students with I-20',
      summary: 'The US Embassy New Delhi has announced a limited batch of emergency F1 student visa interview slots for students with fall 2026 I-20 start dates. The window is open for one week only and will serve applicants who can demonstrate academic enrollment starting August–September 2026.',
      category: 'embassy-update', country: 'USA', source: 'US Embassy New Delhi', sourceType: 'embassy',
      severity: 'positive', tags: ['F1', 'emergency slots', 'US Embassy', 'fall 2026'],
      affectedGroup: 'Indian F1 students with fall 2026 enrollment',
      actionRequired: 'Visit in.usembassy.gov/visas/nonimmigrant-visas/special-f1-appointments immediately. Need valid I-20 with fall 2026 SEVIS start date. Slots fill within hours of posting.',
    },
    {
      id: 'ea3',
      title: 'Canada IRCC Slashes Study Permit Processing to 8 Weeks for 2026 Cohort',
      summary: 'Immigration, Refugees and Citizenship Canada (IRCC) has announced dedicated processing streams for Indian students applying for 2026-27 study permits. Following last year\'s cap controversy, IRCC is proactively managing timelines with a target of 8-week decisions for fully-documented applications.',
      category: 'embassy-update', country: 'Canada', source: 'IRCC Official', sourceType: 'official',
      severity: 'positive', tags: ['Canada', 'study permit', 'IRCC', '2026'],
      affectedGroup: 'Indian students applying for Canadian study permits',
      actionRequired: "Submit biometrics within 30 days of ITA. Use IRCC's certified translation services for documents. Apply online for fastest processing. Ensure GIC (Guaranteed Investment Certificate) is submitted with application.",
    },
    {
      id: 'pc1',
      title: 'Executive Order on Social Media Vetting: All Indian F1 Applicants Face New Screening Layer',
      summary: 'A new executive directive mandates enhanced social media and digital footprint reviews for all F1/J1 applicants from certain countries including India. Consular officers must now review public posts from last 5 years before visa issuance, adding 2–4 weeks to interview scheduling.',
      category: 'policy-change', country: 'USA', source: 'State Dept Cable - Politico', sourceType: 'news',
      severity: 'important', tags: ['social media vetting', 'F1', 'State Department', 'policy'],
      affectedGroup: 'All Indian US visa applicants, especially F1/J1',
      actionRequired: 'Audit your social media immediately. Remove any posts that could be misinterpreted as anti-US sentiment, immigrant intent signals, or politically sensitive content. Do not delete accounts as this raises red flags — archive posts instead.',
    },
    {
      id: 'pc2',
      title: 'Germany Blue Card Now Accessible to Indian IT Professionals Earning €45,300+',
      summary: 'Germany\'s revised EU Blue Card program has lowered the salary threshold for shortage occupations (including IT and engineering) to €45,300/year, making it one of the most accessible routes for skilled Indians. Processing time is 4–6 weeks with family reunification within 3 months.',
      category: 'policy-change', country: 'Germany', source: 'German Federal Employment Agency', sourceType: 'official',
      severity: 'positive', tags: ['Germany', 'Blue Card', 'IT professionals', 'EU'],
      affectedGroup: 'Indian software engineers and tech professionals',
      actionRequired: 'Check job portals (Make it in Germany, StepStone.de). Employers can sponsor Blue Card directly. Learn A1/A2 German for better chances. Consider as alternative to oversubscribed US H1B.',
    },
    {
      id: 'ss1',
      title: 'Success: How This Hyderabad Family Fought 2-Year Visa Battle to Reunite in the US',
      summary: 'Reddit user u/reunited_finally shares how after 26 months of separation, exhausting 3 H4 visa refusals, and filing a federal lawsuit, their family finally received H4 visas last week. Key to success: detailed personal statement, Congressman\'s humanitarian inquiry, and USCIS ombudsman complaint.',
      category: 'success-story', country: 'USA', source: 'r/immigration', sourceType: 'reddit',
      severity: 'positive', tags: ['H4', 'success story', 'family reunion', 'advocacy'],
      affectedGroup: 'Indian families facing H4 visa denials',
      actionRequired: 'Document every refusal carefully. Engage your local US Congressman for humanitarian inquiry. File USCIS Ombudsman complaint if unreasonable delays. Join advocacy groups like Immigration Voice for collective action.',
    },
    {
      id: 'ss2',
      title: 'AMA: "I Got US Visa Appointment in 3 Days Using This Method" — 847 Comments',
      summary: 'A viral Reddit thread details a strategy using multiple VFS account monitoring, USCIS appointment reschedule exploits, and third-country application (via UAE) to secure emergency US visa appointments. The poster, an Indian H4 applicant, details their step-by-step approach.',
      category: 'community-story', country: 'USA', source: 'r/h4visa', sourceType: 'reddit',
      severity: 'info', tags: ['visa appointment', 'tips', 'VFS hack', 'community tips'],
      affectedGroup: 'Indians struggling to book US visa appointments',
    },
  ];

  const criticalAlerts = news.filter(n => n.severity === 'critical');

  return {
    date: today,
    headline: 'H4 EAD Crisis Deepens; VFS US Slots Frozen Across India; F1 Rejections at Record High',
    executiveSummary:
      'Indian visa applicants are navigating one of the most challenging immigration landscapes in a decade. Critical shortages of US consulate appointment slots across all 5 Indian cities, combined with record F1 rejection rates and H4 EAD processing times exceeding 2 years, are devastating families, students, and professionals. Meanwhile, positive developments in Germany and Canada offer alternative pathways for Indian talent.',
    criticalAlerts,
    news,
    generatedAt: new Date().toISOString(),
    sourceCount: 12,
  };
}

function extractJSON(text: string): Record<string, unknown> | null {
  try { return JSON.parse(text); } catch {}
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) { try { return JSON.parse(codeBlock[1]); } catch {} }
  const obj = text.match(/\{[\s\S]*\}/);
  if (obj) { try { return JSON.parse(obj[0]); } catch {} }
  return null;
}

const buildPrompt = (today: string) => `
You are IndiaVisa Daily — an AI news aggregator for visa and immigration challenges faced by Indian nationals.
Today is ${today}.

Search the web for the LATEST news, Reddit discussions, official announcements, and social media updates about:

1. STUDENT VISAS (F1/J1/M1 USA, UK Student, Canada Study Permit, Australia Student)
   - Visa rejection rates and reasons for Indian students
   - Impact on families who invested life savings (₹40–80 lakh typical cost)
   - OPT/CPT/STEM OPT issues causing academic career disruptions
   - University intake delays

2. WORK VISAS (H1B, H4-EAD, L1, UK Skilled Worker, Germany Blue Card)
   - H1B cap, lottery results, RFE trends
   - H4-EAD processing time and its impact on Indian spouses
   - Employment authorization gaps

3. FAMILY VISA / SEPARATION CASES
   - Spouses in India while partner works abroad (H4 delays, spousal visa denials)
   - Visa slot unavailability causing family separation
   - Visitor visa (B1/B2, UK Visit) denials for parents visiting children

4. EMBASSY & VFS UPDATES
   - Appointment slot availability at US, UK, Canada, Australian consulates in India
   - VFS Global, BLS International status
   - Processing time changes

5. POLICY CHANGES affecting Indian passport holders in USA, UK, Canada, Australia, Germany

Return ONLY a valid JSON object (no markdown, no preamble) in this exact structure:
{
  "headline": "Today's most important visa news for Indians in one sentence",
  "executiveSummary": "3-4 sentence overview of today's visa landscape for Indians",
  "criticalAlerts": [],
  "news": [
    {
      "id": "unique_id",
      "title": "concise headline",
      "summary": "2-3 sentence factual summary with specific details",
      "category": "student-visa|work-visa|family-visa|embassy-update|slot-availability|policy-change|community-story|success-story",
      "country": "USA|UK|Canada|Australia|Germany|France|Other",
      "source": "Source name",
      "sourceType": "reddit|official|news|embassy|social",
      "severity": "critical|important|info|positive",
      "tags": ["tag1", "tag2"],
      "actionRequired": "Specific advice for affected Indians",
      "affectedGroup": "Who is affected"
    }
  ]
}

Generate at least 15 news items. criticalAlerts should be a copy of news items with severity "critical".
Focus on real, current challenges and actionable information.
`;

export async function fetchDailyVisaBriefing(): Promise<DailyBriefing> {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  if (!process.env.API_KEY) {
    return getMockBriefing(today);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: buildPrompt(today),
      config: { tools: [{ googleSearch: {} }] },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const data = extractJSON(text) as Record<string, unknown> | null;
    if (!data) return getMockBriefing(today);

    const news = (data.news as VisaNewsItem[]) ?? [];
    const criticalAlerts = (data.criticalAlerts as VisaNewsItem[])?.length
      ? (data.criticalAlerts as VisaNewsItem[])
      : news.filter(n => n.severity === 'critical');

    return {
      date: today,
      headline: (data.headline as string) ?? '',
      executiveSummary: (data.executiveSummary as string) ?? '',
      criticalAlerts,
      news,
      generatedAt: new Date().toISOString(),
      sourceCount: news.length,
    };
  } catch (err) {
    console.error('Gemini fetch failed, using mock data:', err);
    return getMockBriefing(today);
  }
}
