import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setReports } from "../redux/ReportsSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.reports);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/reports");
        const reportsData = response.data
          ? Object.entries(response.data).map(([id, data]) => ({
              id,
              ...data,
            }))
          : [];
        dispatch(setReports(reportsData));
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Banjir Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow"
            >
              {report.image && (
                <img
                  src={`http://localhost:3000${report.image}`}
                  alt={report.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {report.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {report.description}
                </p>
                <div className="mt-2">
                  <p className="mt-2 text-sm text-gray-600">
                    Location: {report.location}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Height: {report.height}m
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Weather: {report.weather}
                  </p>
                </div>
                <p className="mt-2 text-sm font-medium text-indigo-600">
                  By: {report.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
