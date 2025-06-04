"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import Swal from "sweetalert2";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      })
      .catch(() => {
        setError("Failed to fetch user");
        router.push("/login");
      });
  }, []);
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        data.forEach((user) =>
          console.log(`User ${user.email} isBlocked:`, user.isBlocked)
        ); // log isBlocked
        console.log("Fetched users:", data);
      });
  }, []);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((_id) => _id !== id) : [...prev, id]
    );
  };

  const selectAll = (e) => {
    if (e.target.checked) setSelectedIds(users.map((user) => user._id));
    else setSelectedIds([]);
  };

  const handleAction = async (action) => {
    let confirmText = "";
    if (action === "block")
      confirmText = "Are you sure you want to block the selected users?";
    if (action === "unblock")
      confirmText = "Are you sure you want to unblock the selected users?";
    if (action === "delete")
      confirmText =
        "Are you sure you want to delete the selected users? This action cannot be undone.";

    const result = await Swal.fire({
      title: "Confirm",
      text: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userIds: selectedIds }),
    });

    if (res.ok) {
      await Swal.fire({
        icon: "success",
        title: "Success",
        text:
          action === "block"
            ? "Users blocked successfully."
            : action === "unblock"
            ? "Users unblocked successfully."
            : "Users deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      const updated = await (await fetch("/api/users")).json();
      setUsers(updated);
      setSelectedIds([]);
    } else {
      const data = await res.json();
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Action failed.",
      });
    }
  };

  if (!user && !error) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => handleAction("block")}
          className="bg-blue-500 text-white px-3 py-1 rounded flex gap-1 items-center"
        >
          <span>
            <FaLock />
          </span>
          Block
        </button>
        <button
          onClick={() => handleAction("unblock")}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          <span>
            <FaLockOpen />
          </span>
        </button>
        <button
          onClick={() => handleAction("delete")}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          <span>
            <MdDelete />
          </span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content bg-white shadow-md">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedIds.length === users.length}
                  onChange={selectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className={`border-t ${user.isBlocked ? "text-gray-400" : ""}`}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user._id)}
                    onChange={() => toggleCheckbox(user._id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <div className="tooltip tooltip-top" data-tip={user.lastLogin}>
                  <td>
                    {user.lastLogin
                      ? `${formatDistanceToNow(new Date(user.lastLogin), {
                          addSuffix: true,
                        })}`
                      : "Never"}
                  </td>
                </div>
                <td>{user.isBlocked ? "Blocked" : "Active"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
