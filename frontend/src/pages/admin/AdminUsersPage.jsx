import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  UserPlus, 
  Stethoscope, 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  X, 
  Sparkles,
  Building,
  Mail,
  User,
  Phone,
  MapPin,
  AlertCircle
} from 'lucide-react';

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

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  // Provision Form State
  const initialForm = {
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
    province: 'Gauteng',
    organization_or_practice: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadUsers();
  }, [roleFilter, search]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;
      const res = await usersAPI.getAll(params);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await usersAPI.update(user.id, { is_active: !user.is_active });
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    } catch (err) {
      alert("Failed to update user status: " + (err.response?.data?.detail || err.message));
    }
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let generated = "Vet";
    for (let i = 0; i < 7; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    generated += "!";
    setFormData(prev => ({ ...prev, password: generated }));
  };

  const handleOpenModal = () => {
    setFormData(initialForm);
    setModalError('');
    setCreatedCredentials(null);
    setCopied(false);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCreatedCredentials(null);
    setModalError('');
  };

  const handleSubmitProvision = async (e) => {
    e.preventDefault();
    setModalError('');

    if (formData.password.length < 6) {
      setModalError('Assigned password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await usersAPI.createProfessional(formData);
      // Save credentials for display so admin can copy
      setCreatedCredentials({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        organization: formData.organization_or_practice || 'Veterinary Services'
      });
      // Refresh list
      loadUsers();
    } catch (err) {
      setModalError(err.response?.data?.detail || 'Failed to provision veterinary professional.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const credText = `HerdGuard AI Veterinary Professional Account:\nName: ${createdCredentials.full_name}\nEmail: ${createdCredentials.email}\nAssigned Password: ${createdCredentials.password}\nPortal URL: ${window.location.origin}/login`;
    navigator.clipboard.writeText(credText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">User Account Management</h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Review registered farmers, provision veterinary professionals, and maintain administrative oversight
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          <Stethoscope className="w-4 h-4" />
          <span>Add Veterinary Professional</span>
        </button>
      </div>

      {/* Info Callout Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex items-start space-x-3 text-xs text-blue-900">
        <ShieldCheck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Credential Policy & Veterinary Professional Provisioning</p>
          <p className="text-blue-800/90 leading-relaxed text-[11px]">
            To uphold biosecurity and regulatory compliance, veterinary professionals and extension officers 
            <strong> cannot self-register</strong>. Accounts must be provisioned directly by an administrator who assigns their login credentials.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white"
        >
          <option value="">All Roles</option>
          <option value="farmer">Farmers</option>
          <option value="professional">Veterinary Professionals</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading user directory..." />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="No accounts match your search filters." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-cream-surface/70 uppercase text-[10px] font-bold tracking-wider text-charcoal-muted border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Province & Enterprise</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-cream-surface/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal flex items-center space-x-1.5">
                        <span>{u.full_name}</span>
                        {u.role === 'professional' && (
                          <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        {u.role === 'admin' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        )}
                      </div>
                      <div className="text-[11px] text-charcoal-muted">{u.email}</div>
                    </td>

                    <td className="py-3.5 px-4 capitalize">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        u.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : u.role === 'professional'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-forest-100 text-forest-800'
                      }`}>
                        {u.role === 'professional' ? 'Veterinary Professional' : u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted">
                      <div>{u.province || '—'}</div>
                      <div className="text-[11px] font-medium">{u.organization_or_practice || '—'}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-charcoal-muted">
                      {u.phone_number || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          u.is_active
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provision Veterinary Professional Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative my-8">
            <button
              onClick={handleCloseModal}
              className="absolute right-5 top-5 p-1 rounded-xl text-gray-400 hover:text-charcoal hover:bg-cream transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!createdCredentials ? (
              <>
                <div className="flex items-center space-x-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-charcoal">Add Veterinary Professional</h2>
                    <p className="text-xs text-charcoal-muted">
                      Assign official credentials for a qualified vet or extension officer
                    </p>
                  </div>
                </div>

                {modalError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitProvision} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                      Full Name & Title *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="e.g. Dr. Lerato Khumalo, BVSc"
                        className="w-full pl-9 pr-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                      Veterinary Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="vet.khumalo@statevet.gov.za"
                        className="w-full pl-9 pr-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                        Admin-Assigned Password *
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[11px] text-forest-700 hover:text-forest-900 font-semibold flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Generate Secure</span>
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Assign an initial password (min. 6 chars)"
                        className="w-full pl-9 pr-10 py-2 bg-cream border border-gray-200 rounded-xl text-xs font-mono text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-charcoal"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-charcoal-muted mt-1">
                      The veterinarian will log in using this password.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                        Assigned Province
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <select
                          value={formData.province}
                          onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white focus:outline-none"
                        >
                          {SA_PROVINCES.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          placeholder="+27 82 000 0000"
                          className="w-full pl-9 pr-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                      Practice / Extension Office
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={formData.organization_or_practice}
                        onChange={(e) => setFormData({ ...formData, organization_or_practice: e.target.value })}
                        placeholder="e.g. State Veterinary Directorate / Highveld Clinic"
                        className="w-full pl-9 pr-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-muted hover:bg-cream transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{submitting ? 'Provisioning...' : 'Provision Vet Account'}</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success confirmation view with copyable credentials */
              <div className="text-center py-2 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-charcoal">Veterinary Account Provisioned!</h3>
                  <p className="text-xs text-charcoal-muted mt-1">
                    The veterinary professional account was successfully created. Share these assigned credentials with the veterinarian:
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cream border border-gray-200 text-left space-y-2 font-mono text-xs">
                  <div>
                    <span className="text-charcoal-muted text-[11px] block">Veterinarian Name</span>
                    <span className="text-charcoal font-semibold">{createdCredentials.full_name}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-muted text-[11px] block">Assigned Email (Login Username)</span>
                    <span className="text-charcoal font-semibold">{createdCredentials.email}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-muted text-[11px] block">Admin-Assigned Password</span>
                    <span className="text-forest-800 font-bold bg-white px-2 py-0.5 rounded border border-gray-200 inline-block">
                      {createdCredentials.password}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleCopyCredentials}
                    className="px-4 py-2.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200 text-xs font-bold transition flex items-center space-x-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-forest-700" /> : <Copy className="w-4 h-4 text-forest-700" />}
                    <span>{copied ? 'Credentials Copied!' : 'Copy Login Details'}</span>
                  </button>

                  <button
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

