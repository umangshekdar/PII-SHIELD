import { ShieldAlert, CreditCard, User, Mail, MapPin } from 'lucide-react';

export default function SummaryCards({ summary = {}, detections = [] }) {
  // Use the summary from backend if available, otherwise compute from detections
  const govIds = summary.government_ids ?? detections.filter(d => d.category === 'government_id').length;
  const financial = summary.financial_information ?? detections.filter(d => d.category === 'financial_information').length;
  const sensitive = summary.sensitive_personal_information ?? detections.filter(d => d.category === 'sensitive_personal_information').length;
  const contact = (summary.contact_information ?? 0) + (summary.personal_information ?? 0) || 
    detections.filter(d => ['contact_information', 'personal_information'].includes(d.category)).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-start space-x-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-lg shrink-0">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Government IDs</p>
          <p className="text-2xl font-bold text-slate-800">{govIds}</p>
          {govIds > 0 && <p className="text-xs text-red-500 mt-1">High sensitivity</p>}
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm flex items-start space-x-4">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg shrink-0">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Financial Info</p>
          <p className="text-2xl font-bold text-slate-800">{financial}</p>
          {financial > 0 && <p className="text-xs text-orange-500 mt-1">High sensitivity</p>}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm flex items-start space-x-4">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Sensitive Personal</p>
          <p className="text-2xl font-bold text-slate-800">{sensitive}</p>
          {sensitive > 0 && <p className="text-xs text-amber-500 mt-1">Address / sensitive data</p>}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm flex items-start space-x-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
          <Mail className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Contact Info</p>
          <p className="text-2xl font-bold text-slate-800">{contact}</p>
          <p className="text-xs text-blue-500 mt-1">Detected for awareness, kept visible</p>
        </div>
      </div>
    </div>
  );
}
