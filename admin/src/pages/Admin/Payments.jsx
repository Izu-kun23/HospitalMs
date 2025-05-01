import React, { useState } from "react";

const Payments = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      user: "John Doe",
      amount: 100.0,
      date: "2024-12-20",
      status: "Completed",
      notes: "",
      refundReason: "",
    },
    {
      id: 2,
      user: "Jane Smith",
      amount: 50.0,
      date: "2024-12-22",
      status: "Completed",
      notes: "",
      refundReason: "",
    },
    {
      id: 3,
      user: "China Farlene",
      amount: 50.0,
      date: "2024-12-22",
      status: "Completed",
      notes: "",
      refundReason: "",
    },
    {
      id: 4,
      user: "Danny Smith", 
      amount: 50.0,
      date: "2024-12-22",
      status: "Completed",
      notes: "",
      refundReason: "",
    },
    {
      id: 5,
      user: "Cochise Smith",
      amount: 50.0,
      date: "2024-12-22",
      status: "Completed",
      notes: "",
      refundReason: "",
    },
    {
      id: 6,
      user: "Playboi Carti",
      amount: 50.0,
      date: "2024-12-22",
      status: "Completed",
      notes: "",
      refundReason: "",
    },

    
  ]);
  const [showModal, setShowModal] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState(null);
  const [refundNotes, setRefundNotes] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const handleRefundClick = (id) => {
    setCurrentPaymentId(id);
    setShowModal(true);
  };

  const handleRefundConfirm = () => {
    const updatedPayments = payments.map((payment) => {
      if (payment.id === currentPaymentId) {
        payment.status = "Refunded";
        payment.notes = refundNotes;
        payment.refundReason = refundReason;
      }
      return payment;
    });
    setPayments(updatedPayments);
    setShowModal(false);
    setRefundNotes("");
    setRefundReason("");
  };

  const handleRefundCancel = () => {
    setShowModal(false);
    setRefundNotes("");
    setRefundReason("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Payments</h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Notes</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Refund Reason</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{payment.user}</td>
                <td className="px-6 py-4 text-sm text-gray-700">${payment.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.date}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span
                    className={`${
                      payment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    } px-2 py-1 rounded text-xs`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.notes}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{payment.refundReason}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    className="px-4 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                    onClick={() => handleRefundClick(payment.id)}
                    disabled={payment.status === "Refunded"}
                  >
                    Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refund Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Refund Payment</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Refund Notes</label>
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="Enter refund notes"
                value={refundNotes}
                onChange={(e) => setRefundNotes(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Refund Reason</label>
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="Enter reason for refund"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-sm text-gray-700 rounded-md hover:bg-gray-400"
                onClick={handleRefundCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                onClick={handleRefundConfirm}
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;