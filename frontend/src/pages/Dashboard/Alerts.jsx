import React from "react";
import { Badge, Card, Button } from "flowbite-react";

// Mock data for now (static)
const mockAlerts = [
  {
    id: 1,
    type: "Critical",
    message: "Roof Tank 1 is below 20%",
    timestamp: "2025-11-25 10:12:45",
  },
  {
    id: 2,
    type: "Warning",
    message: "Pump 2 is offline",
    timestamp: "2025-11-25 09:50:12",
  },
  {
    id: 3,
    type: "Resolved",
    message: "Water level back to normal in Tank 3",
    timestamp: "2025-11-24 17:30:10",
  },
];

// Function to map type to Flowbite badge color
const alertColor = (type) => {
  switch (type) {
    case "Critical":
      return "failure"; // red
    case "Warning":
      return "warning"; // yellow
    case "Resolved":
      return "success"; // green
    default:
      return "info";
  }
};

function Alerts() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">System Alerts</h2>

      <div className="flex flex-wrap gap-4">
        {mockAlerts.map((alert) => (
          <Card
            key={alert.id}
            className="flex flex-col justify-between p-4 flex-1 min-w-[250px] max-w-[350px]"
          >
            <div className="mb-4">
              <h3 className="font-medium">{alert.message}</h3>
              <p className="text-sm text-gray-500">{alert.timestamp}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge color={alertColor(alert.type)}>{alert.type}</Badge>
              <Button color="light" size="xs">
                Mark Resolved
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
