const SensorCard = ({ label, value, unit, status, icon }) => {
  const statusColor = {
    good:    'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    danger:  'text-red-600 bg-red-50 border-red-200',
    unknown: 'text-gray-500 bg-gray-50 border-gray-200',
  }[status || 'unknown'];

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${statusColor}`}>
      <div className="flex items-center gap-2 mb-1 text-sm font-medium">
        {icon} {label}
      </div>
      <div className="text-2xl font-bold">
        {value !== null && value !== undefined ? value : '—'}
        <span className="text-sm font-normal ml-1">{unit}</span>
      </div>
    </div>
  );
};

export default SensorCard;