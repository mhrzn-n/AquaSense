import { useState, useEffect } from "react";
import { getAlerts } from "../../services/api";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

const alertLabels = {
  LOW: "Low Water Level",
  OVERFLOW: "Overflow Risk",
  HIGH_TDS: "High TDS — Dissolved Solids",
  LOW_PH: "Low pH — Acidic Water",
  HIGH_PH: "High pH — Alkaline Water",
  HIGH_TURBIDITY: "High Turbidity — Cloudy Water",
};

const alertStyles = {
  LOW: "border-red-200 bg-red-50 text-red-700",
  OVERFLOW: "border-red-200 bg-red-50 text-red-700",
  HIGH_TDS: "border-yellow-200 bg-yellow-50 text-yellow-700",
  LOW_PH: "border-yellow-200 bg-yellow-50 text-yellow-700",
  HIGH_PH: "border-yellow-200 bg-yellow-50 text-yellow-700",
  HIGH_TURBIDITY: "border-orange-200 bg-orange-50 text-orange-700",
};

const alertIcons = {
  LOW: <AlertTriangle size={20} />,
  OVERFLOW: <AlertTriangle size={20} />,
  HIGH_TDS: <Info size={20} />,
  LOW_PH: <Info size={20} />,
  HIGH_PH: <Info size={20} />,
  HIGH_TURBIDITY: <Info size={20} />,
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAlerts()
      .then(data => setAlerts(data.alerts || []))
      .catch(() => setError('Failed to load alerts.'))
      .finally(() => setLoading(false));
  }, []);

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Alerts</h1>
          <p className="mt-2 text-slate-600">
            Water quality and level alerts for your tanks
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              All clear
            </h3>
            <p className="text-slate-500">
              No alerts at the moment. Your water quality looks good.
            </p>
          </div>
        ) : (
          <>
            {/* ACTIVE ALERTS */}
            {activeAlerts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-700 mb-4">
                  Active ({activeAlerts.length})
                </h2>
                <div className="space-y-3">
                  {activeAlerts.map(alert => (
                    <div
                      key={alert.alertId}
                      className={`flex items-start gap-4 p-4 rounded-xl border ${alertStyles[alert.type] || 'border-slate-200 bg-white text-slate-700'}`}
                    >
                      <div className="mt-0.5">
                        {alertIcons[alert.type] || <Info size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">
                          {alertLabels[alert.type] || alert.type}
                        </div>
                        <div className="text-sm mt-1 opacity-80">
                          Tank: {alert.tankName} — Recorded value: {alert.value} (threshold: {alert.threshold})
                        </div>
                        <div className="text-xs mt-1 opacity-60">
                          {new Date(alert.triggered_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESOLVED ALERTS */}
            {resolvedAlerts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-700 mb-4">
                  Resolved ({resolvedAlerts.length})
                </h2>
                <div className="space-y-3">
                  {resolvedAlerts.map(alert => (
                    <div
                      key={alert.alertId}
                      className="flex items-start gap-4 p-4 rounded-xl border border-green-200 bg-green-50 text-green-700"
                    >
                      <div className="mt-0.5">
                        <CheckCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">
                          {alertLabels[alert.type] || alert.type}
                        </div>
                        <div className="text-sm mt-1 opacity-80">
                          Tank: {alert.tankName} — Resolved
                        </div>
                        <div className="text-xs mt-1 opacity-60">
                          {new Date(alert.triggered_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Alerts;