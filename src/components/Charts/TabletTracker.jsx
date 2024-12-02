import React from "react";

const TabletTracker = () => {
  const usageData = [
    { region: "North", percentage: 80, label: "80%", colorClass: "north-bar" },
    { region: "East", percentage: 60, label: "60%", colorClass: "east-bar" },
    {
      region: "Central",
      percentage: 90,
      label: "90%",
      colorClass: "central-bar",
    },
    { region: "West", percentage: 75, label: "75%", colorClass: "west-bar" },
  ];

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card">
          <div className="card-header no-border">
            <h3>Tablet Usage Tracker</h3>
          </div>
          <div className="card-body">
            {usageData.map((data, index) => (
              <div className="progress-wrapper" key={index}>
                <span className="progress-text">{data.region}</span>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={data.percentage}
                  style={{ width: `${data.percentage}%` }}
                >
                  <span className="progress-percentage">{data.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card">
          <div className="card-header no-border">
            <h3>Tablet Usage Tracker</h3>
          </div>
          <div className="card-body">
            {usageData.map((data, index) => (
              <div className="progress-wrapper" key={index}>
                <span className="progress-text">{data.region}</span>
                <div
                  className="progress-bar-center"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={data.percentage}
                  style={{ width: `${data.percentage}%` }}
                >
                  <span className="progress-percentage">{data.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card">
          <div className="card-header no-border">
            <h3>Tablet Usage Tracker</h3>
          </div>
          <div className="card-body">
            {usageData.map((data, index) => (
              <div className="progress-wrapper" key={index}>
                <span className="progress-text">{data.region}</span>
                <div
                  className="progress-bar-right"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={data.percentage}
                  style={{ width: `${data.percentage}%` }}
                >
                  <span className="progress-percentage">{data.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabletTracker;
