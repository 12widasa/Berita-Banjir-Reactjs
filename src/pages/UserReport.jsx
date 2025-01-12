import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setReports, deleteReport, updateReport } from "../redux/ReportsSlice"; // Assuming you have a delete action
import Swal from "sweetalert2"; // SweetAlert2 for confirmation dialogs
import Modal from "react-modal"; // React Modal for update form

const UserReport = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.reports);
  const user = useSelector((state) => state.auth.user);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    location: "",
    height: "",
    weather: "",
  });

  const loading = useSelector((state) => state.auth.loading); // Mengambil state loading dari Redux

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/reports/${user.uid}`
        );
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

      console.log("reports", reports);
    };

    fetchReports();
  }, [dispatch]);

  const handleDelete = (id) => {
    // SweetAlert2 confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/api/reports/${id}`)
          .then(() => {
            dispatch(deleteReport(id));
            Swal.fire("Deleted!", "Your report has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting report:", error);
            Swal.fire("Error!", "Failed to delete the report.", "error");
          });
      }
    });
  };

  const openUpdateModal = (report) => {
    setCurrentReport(report);
    setFormData({
      title: report.title,
      image: report.image,
      description: report.description,
      location: report.location,
      height: report.height,
      weather: report.weather,
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append(
      "reportData",
      JSON.stringify({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        height: formData.height,
        weather: formData.weather,
      })
    );

    formDataToSend.append("image", formData.image);

    try {
      await axios.put(
        `http://localhost:3000/api/reports/${currentReport.id}`,
        formDataToSend
      );
      Swal.fire("Updated!", "Your report has been updated.", "success");
      setModalIsOpen(false);

      dispatch(
        updateReport({
          id: currentReport.id,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          height: formData.height,
          weather: formData.weather,
          image: formData.image, // Assuming this is a URL or object format
        })
      );
    } catch (error) {
      Swal.fire("Error!", "Failed to update the report.", "error");
      console.error("Error updating report:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {reports.length === 0 ? "No reports found" : "Riwayat"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {report.image && (
                <img
                  src={`http://localhost:3000${report.image}`}
                  alt={report.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 text-gray-600">{report.description}</p>
                <div className="mt-2">
                  <p className="text-sm">Location: {report.location}</p>
                  <p className="text-sm">Height: {report.height}m</p>
                  <p className="text-sm">Weather: {report.weather}</p>
                </div>
                <p className="mt-2 text-sm text-blue-600">
                  By: {report.author}
                </p>

                <div className="mt-4 flex space-x-4">
                  <button
                    className="flex-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setCurrentReport(report);
                      setFormData({
                        title: report.title,
                        description: report.description,
                        location: report.location,
                        height: report.height,
                        weather: report.weather,
                        image: report.image,
                      });
                      setModalIsOpen(true);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                    onClick={() => handleDelete(report.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="max-w-2xl mx-auto mt-20 bg-white p-6 rounded-lg shadow-xl"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Update Report
          </h3>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="mt-1 block w-full"
                accept="image/*"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Height (meters)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weather
              </label>
              <input
                type="text"
                name="weather"
                value={formData.weather}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Report"}
              </button>
              <button
                type="button"
                onClick={() => setModalIsOpen(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default UserReport;
