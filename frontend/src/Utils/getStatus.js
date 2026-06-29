export function getStatus(sensor, value) {
  if (value === null || value === undefined) return 'unknown';

  switch (sensor) {
    case 'level':
      if (value >= 20 && value <= 95) return 'good';
      if (value >= 10 && value < 20) return 'warning';
      return 'danger';

    case 'temperature':
      if (value >= 10 && value <= 35) return 'good';
      if (value > 35 && value <= 40) return 'warning';
      return 'danger';

    case 'tds':
      if (value < 300) return 'good';
      if (value >= 300 && value <= 500) return 'warning';
      return 'danger';

    case 'ph':
      if (value >= 6.5 && value <= 8.5) return 'good';
      if ((value >= 6.0 && value < 6.5) || (value > 8.5 && value <= 9.0)) return 'warning';
      return 'danger';

    case 'turbidity':
      if (value < 2) return 'good';
      if (value >= 2 && value <= 4) return 'warning';
      return 'danger';

    case 'freshness_window_hours':
      if (value > 12) return 'good';
      if (value >= 6 && value <= 12) return 'warning';
      return 'danger';

    default:
      return 'unknown';
  }
}