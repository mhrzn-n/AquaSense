import { useEffect, useState } from 'react';
import { getForecast } from '../services/api';

const ForecastWidget = ({ tankId }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tankId) return;
    getForecast(tankId)
      .then(data => setForecast(data))
      .finally(() => setLoading(false));
  }, [tankId]);

  if (loading) return (
    <div className="p-4 text-gray-400">Loading forecast...</div>
  );
  
  if (!forecast) return null;

  const { freshness_window_hours, risk_score } = forecast;
  const riskPercent = Math.round((risk_score || 0) * 100);
  const riskColor = risk_score < 0.4
    ? 'bg-green-500'
    : risk_score < 0.7
    ? 'bg-yellow-500'
    : 'bg-red-500';

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-700 mb-3">
        💧 Predictive Freshness Forecast
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Estimated time before water quality degrades — not a safety certification.
      </p>
      <div className="flex gap-6 items-center">
        <div>
          <div className="text-3xl font-bold text-blue-700">
            {freshness_window_hours !== null ? `${freshness_window_hours}h` : '—'}
          </div>
          <div className="text-xs text-gray-500">Freshness remaining</div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Risk Score</span>
            <span className="font-medium">{riskPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${riskColor}`}
              style={{ width: `${riskPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastWidget;