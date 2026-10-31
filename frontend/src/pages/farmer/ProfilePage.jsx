import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../services/api';
import { User, Mail, Phone, MapPin, Building, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone_number: user?.phone_number || '',
    province: user?.province || 'Free State',
    organization_or_practice: user?.organization_or_practice || '',
    password: '',
    confirm_password: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (formData.password && formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (formData.password && formData.password !== formData.confirm_password) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        province: formData.province,
        organization_or_practice: formData.organization_or_practice,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await usersAPI.update(user.id, payload);
      await refreshUser();
      setSuccessMsg('Profile updated successfully.');
      setFormData(prev => ({ ...prev, password: '', confirm_password: '' }));
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal">Account & Profile Settings</h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Manage your personal details and South African agricultural contact preferences
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
        {/* Read-only account overview */}
        <div className="flex items-center space-x-4 pb-6 mb-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-bold text-xl">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-charcoal">{user?.full_name}</h2>
            <div className="flex items-center space-x-2 text-xs text-charcoal-muted mt-0.5">
              <span>{user?.email}</span>
              <span>•</span>
              <span className="font-semibold text-forest-700 capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="+27 82 000 0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                Province
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white"
                >
                  {SA_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
              Organization / Farm Enterprise
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={formData.organization_or_practice}
                onChange={(e) => setFormData({ ...formData, organization_or_practice: e.target.value })}
                placeholder="Farm name or professional practice"
                className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-bold text-sm text-charcoal mb-3">Change Password (Leave blank to keep unchanged)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="New password"
                    className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
