"use client";

import { useEffect, useState } from "react";
import { FaKey, FaPlus, FaSave, FaTimes, FaUserShield, FaUsers } from "react-icons/fa";

const blankUser = { username: "", name: "", password: "", role: "STAFF" };

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Request failed.");
  return result;
}

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState(blankUser);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await requestJson("/api/admin/users"));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await requestJson("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      setNewUser(blankUser);
      setNotice("User berhasil dibuat.");
      await loadUsers();
    } catch (createError) {
      setError(createError.message);
    }
  };

  const saveUser = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await requestJson(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingUser.name, role: editingUser.role }),
      });
      setEditingUser(null);
      setNotice("User berhasil diperbarui.");
      await loadUsers();
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await requestJson(`/api/admin/users/${passwordUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      setPasswordUser(null);
      setNewPassword("");
      setNotice("Password diperbarui dan sesi user sebelumnya dicabut.");
    } catch (passwordError) {
      setError(passwordError.message);
    }
  };

  const deactivateUser = async (user) => {
    if (!window.confirm(`Nonaktifkan akun ${user.username}?`)) return;
    setError("");
    try {
      await requestJson(`/api/admin/users/${user.id}`, { method: "DELETE" });
      setNotice("Akun dinonaktifkan dan semua sesinya dicabut.");
      await loadUsers();
    } catch (deactivateError) {
      setError(deactivateError.message);
    }
  };

  return (
    <div className="fixed left-0 top-16 bottom-10 right-0 md:left-64 pt-14 pb-6 md:pt-10 px-8 overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
        <FaUsers className="text-yellow-500 mr-3" /> Users
      </h2>

      {error && <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">{error}</p>}
      {notice && <p role="status" className="mb-4 text-sm text-green-700 dark:text-green-300">{notice}</p>}

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <FaPlus className="mr-2 text-yellow-500" /> Tambah User
        </h3>
        <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Username
            <input required minLength={3} maxLength={64} pattern="[a-zA-Z0-9._-]+" value={newUser.username} onChange={(event) => setNewUser({ ...newUser, username: event.target.value.toLowerCase() })} className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Nama
            <input required maxLength={120} value={newUser.name} onChange={(event) => setNewUser({ ...newUser, name: event.target.value })} className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Password awal
            <input required type="password" minLength={12} value={newUser.password} onChange={(event) => setNewUser({ ...newUser, password: event.target.value })} className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Role
            <select value={newUser.role} onChange={(event) => setNewUser({ ...newUser, role: event.target.value })} className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
              <option value="STAFF">Staff</option>
              <option value="SUPERUSER">Superuser</option>
            </select>
          </label>
          <button type="submit" className="bg-red-700 text-white p-2 rounded flex items-center justify-center"><FaPlus className="mr-2" /> Buat User</button>
        </form>
      </section>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr><th className="p-3">Username</th><th className="p-3">Nama</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Aksi</th></tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-200">
            {loading ? <tr><td colSpan="5" className="p-4">Memuat user...</td></tr> : users.map((user) => (
              <tr key={user.id} className="border-t dark:border-gray-700">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.role === "SUPERUSER" ? "Superuser" : "Staff"}</td>
                <td className="p-3">{user.isActive ? "Aktif" : "Nonaktif"}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  <button onClick={() => setEditingUser({ id: user.id, name: user.name, role: user.role })} aria-label={`Edit ${user.username}`} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                  <button onClick={() => { setPasswordUser(user); setNewPassword(""); }} aria-label={`Reset password ${user.username}`} className="px-3 py-1 bg-gray-600 text-white rounded"><FaKey /></button>
                  {user.isActive && <button onClick={() => deactivateUser(user)} className="px-3 py-1 bg-red-700 text-white rounded">Nonaktifkan</button>}
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && <tr><td colSpan="5" className="p-4">Belum ada user.</td></tr>}
          </tbody>
        </table>
      </div>

      {(editingUser || passwordUser) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={editingUser ? saveUser : resetPassword} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              {editingUser ? <><FaUserShield className="mr-2" /> Edit User</> : <><FaKey className="mr-2" /> Reset Password</>}
            </h3>
            {editingUser ? <>
              <label className="block text-sm">Nama<input required maxLength={120} value={editingUser.name} onChange={(event) => setEditingUser({ ...editingUser, name: event.target.value })} className="mt-1 w-full p-2 border rounded dark:bg-gray-700" /></label>
              <label className="block text-sm">Role<select value={editingUser.role} onChange={(event) => setEditingUser({ ...editingUser, role: event.target.value })} className="mt-1 w-full p-2 border rounded dark:bg-gray-700"><option value="STAFF">Staff</option><option value="SUPERUSER">Superuser</option></select></label>
            </> : <label className="block text-sm">Password baru<input required type="password" minLength={12} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-1 w-full p-2 border rounded dark:bg-gray-700" /></label>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setEditingUser(null); setPasswordUser(null); }} className="px-4 py-2 border rounded flex items-center"><FaTimes className="mr-2" /> Batal</button>
              <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded flex items-center"><FaSave className="mr-2" /> Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}