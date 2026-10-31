import React, { useState, useEffect } from 'react';
import { activityLogsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { ShieldCheck, Search, Filter } from 'lucide-react';

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    loadLogs();
  }, [actionFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (actionFilter) params.action = actionFilter;
      const res = await activityLogsAPI.getAll(params);
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load activity logs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">System Activity Logs</h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Complete audit trail of user logins, registrations, cattle updates, reports, and reviews
          </p>
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-charcoal"
        >
          <option value="">All Actions</option>
          <option value="LOGIN">LOGIN</option>
          <option value="REGISTER">REGISTER</option>
          <option value="CREATE_FARM">CREATE_FARM</option>
          <option value="CREATE_ANIMAL">CREATE_ANIMAL</option>
          <option value="SUBMIT_HEALTH_REPORT">SUBMIT_HEALTH_REPORT</option>
          <option value="REVIEW_HEALTH_REPORT">REVIEW_HEALTH_REPORT</option>
          <option value="CREATE_VACCINATION">CREATE_VACCINATION</option>
          <option value="CREATE_INCIDENT">CREATE_INCIDENT</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading activity logs..." />
      ) : logs.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No activity logs" description="No activity records match your filter." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-cream-surface/70 uppercase text-[10px] font-bold tracking-wider text-charcoal-muted border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-cream-surface/50 transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-charcoal">{log.user_name}</div>
                      <div className="text-[10px] text-charcoal-muted">{log.user_email || '—'}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-forest-100 text-forest-900 font-mono text-[11px] font-bold">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-charcoal-muted">
                      {log.entity_type ? `${log.entity_type} #${log.entity_id || ''}` : '—'}
                    </td>

                    <td className="py-3 px-4 text-charcoal">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
