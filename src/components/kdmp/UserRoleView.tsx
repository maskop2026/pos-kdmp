import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Users,
  UserCheck,
  UserPlus,
  KeyRound,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Lock,
  CheckCircle,
  Tag,
  Info,
} from 'lucide-react';
import { RoleItem, UserItem } from '../../types/kdmp';
import { INITIAL_ROLES, INITIAL_USERS } from '../../data/kdmpData';

interface UserRoleViewProps {
  onShowToast?: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  users?: UserItem[];
  onUpdateUsers?: (users: UserItem[]) => void;
}

export const UserRoleView: React.FC<UserRoleViewProps> = ({
  onShowToast,
  users: propUsers,
  onUpdateUsers,
}) => {
  // State
  const [internalUsers, setInternalUsers] = useState<UserItem[]>(INITIAL_USERS);
  const users = propUsers || internalUsers;

  const setUsers = (updater: UserItem[] | ((prev: UserItem[]) => UserItem[])) => {
    const updated = typeof updater === 'function' ? updater(users) : updater;
    if (onUpdateUsers) {
      onUpdateUsers(updated);
    }
    setInternalUsers(updated);
  };

  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);

  // Tab State: 'users' | 'roles'
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  // Search & Pagination Users
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  // Modals State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

  // Form User Fields
  const [userName, setUserName] = useState('');
  const [userUsername, setUserUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRoleId, setUserRoleId] = useState<number>(1);
  const [userStatus, setUserStatus] = useState<'Aktif' | 'Non-Aktif'>('Aktif');

  // Form Role Fields
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleStatus, setRoleStatus] = useState<'Aktif' | 'Non-Aktif'>('Aktif');

  // Modal Delete State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'user' | 'role';
    id: number;
    name: string;
  } | null>(null);

  // Active Roles for dropdown (SELECT * FROM roles WHERE status='Aktif')
  const activeRoles = useMemo(() => {
    return roles.filter((r) => r.status === 'Aktif');
  }, [roles]);

  // Filtered Users (Search by name or username)
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.role_name && u.role_name.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  // Paginated Users
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / limit) || 1;
  const startIndex = (currentPage - 1) * limit;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.role_name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [roles, searchQuery]);

  // ==========================================
  // HANDLERS: USER CRUD
  // ==========================================
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserName('');
    setUserUsername('');
    setUserPassword('');
    setUserRoleId(activeRoles[0]?.id || 1);
    setUserStatus('Aktif');
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: UserItem) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserUsername(user.username);
    setUserPassword(''); // Kosongkan saat edit
    setUserRoleId(user.role_id);
    setUserStatus(user.status);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !userUsername.trim()) {
      if (onShowToast) {
        onShowToast('warning', 'Validasi Gagal', 'Nama lengkap dan username wajib diisi!');
      }
      return;
    }

    const selectedRole = roles.find((r) => r.id === Number(userRoleId));
    const roleTitle = selectedRole?.role_name || 'Staff';

    // 1. TAMBAH USER (store_user)
    if (!editingUser) {
      if (!userPassword) {
        if (onShowToast) {
          onShowToast('warning', 'Password Kosong', 'Password wajib diisi saat tambah user baru!');
        }
        return;
      }

      // Cek username duplicate
      const check = users.some(
        (u) => u.username.toLowerCase() === userUsername.trim().toLowerCase()
      );
      if (check) {
        if (onShowToast) {
          onShowToast('warning', 'Username Duplikat', `Username '${userUsername}' sudah dipakai!`);
        }
        return;
      }

      const newUser: UserItem = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        name: userName.trim(),
        username: userUsername.trim(),
        password: userPassword.trim(),
        role_id: Number(userRoleId),
        role_name: roleTitle,
        status: userStatus,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };

      setUsers([newUser, ...users]);
      setIsUserModalOpen(false);
      if (onShowToast) {
        onShowToast('success', 'User Berhasil Ditambahkan', `Pengguna ${newUser.name} (${newUser.username}) telah terdaftar dengan password baru.`);
      }
    } else {
      // 2. EDIT USER (update_user)
      // Cek username duplicate with other users
      const check = users.some(
        (u) =>
          u.id !== editingUser.id &&
          u.username.toLowerCase() === userUsername.trim().toLowerCase()
      );
      if (check) {
        if (onShowToast) {
          onShowToast('warning', 'Username Duplikat', `Username '${userUsername}' sudah dipakai oleh user lain!`);
        }
        return;
      }

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === editingUser.id) {
            return {
              ...u,
              name: userName.trim(),
              username: userUsername.trim(),
              ...(userPassword.trim() ? { password: userPassword.trim() } : {}),
              role_id: Number(userRoleId),
              role_name: roleTitle,
              status: userStatus,
            };
          }
          return u;
        })
      );

      setIsUserModalOpen(false);
      if (onShowToast) {
        onShowToast('success', 'Data User Diperbarui', `Data pengguna ${userName} berhasil diperbarui!`);
      }
    }
  };

  // ==========================================
  // HANDLERS: ROLE CRUD
  // ==========================================
  const handleOpenAddRole = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setRoleStatus('Aktif');
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: RoleItem) => {
    setEditingRole(role);
    setRoleName(role.role_name);
    setRoleDescription(role.description);
    setRoleStatus(role.status);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      if (onShowToast) {
        onShowToast('warning', 'Validasi Gagal', 'Nama role wajib diisi!');
      }
      return;
    }

    if (!editingRole) {
      // Cek duplicate role_name
      const check = roles.some(
        (r) => r.role_name.toLowerCase() === roleName.trim().toLowerCase()
      );
      if (check) {
        if (onShowToast) {
          onShowToast('warning', 'Role Sudah Ada', `Role '${roleName}' sudah ada!`);
        }
        return;
      }

      const newRole: RoleItem = {
        id: roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1,
        role_name: roleName.trim(),
        description: roleDescription.trim() || 'Role akses sistem KDMP',
        status: roleStatus,
      };

      setRoles([...roles, newRole]);
      setIsRoleModalOpen(false);
      if (onShowToast) {
        onShowToast('success', 'Role Berhasil Ditambahkan', `Role '${newRole.role_name}' telah tersimpan.`);
      }
    } else {
      // Edit Role
      const check = roles.some(
        (r) =>
          r.id !== editingRole.id &&
          r.role_name.toLowerCase() === roleName.trim().toLowerCase()
      );
      if (check) {
        if (onShowToast) {
          onShowToast('warning', 'Role Sudah Ada', `Role '${roleName}' sudah ada!`);
        } else {
          alert(`Role '${roleName}' sudah ada!`);
        }
        return;
      }

      setRoles((prev) =>
        prev.map((r) => {
          if (r.id === editingRole.id) {
            return {
              ...r,
              role_name: roleName.trim(),
              description: roleDescription.trim(),
              status: roleStatus,
            };
          }
          return r;
        })
      );

      // Update role_name in users as well
      setUsers((prev) =>
        prev.map((u) => (u.role_id === editingRole.id ? { ...u, role_name: roleName.trim() } : u))
      );

      setIsRoleModalOpen(false);
      if (onShowToast) {
        onShowToast('success', 'Role Diperbarui', `Role '${roleName}' berhasil disimpan.`);
      }
    }
  };

  // ==========================================
  // CONFIRM DELETE (Pencegahan ID 1 Super Admin)
  // ==========================================
  const handleExecuteDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'user') {
      if (deleteTarget.id === 1) {
        if (onShowToast) {
          onShowToast('warning', 'Pencegahan Sistem', 'Super Admin utama (ID 1) tidak bisa dihapus!');
        } else {
          alert('Super Admin utama tidak bisa dihapus!');
        }
        setDeleteTarget(null);
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      if (onShowToast) {
        onShowToast('success', 'User Dihapus', `User '${deleteTarget.name}' berhasil dihapus.`);
      }
    } else if (deleteTarget.type === 'role') {
      if (deleteTarget.id === 1) {
        if (onShowToast) {
          onShowToast('warning', 'Pencegahan Sistem', 'Role Super Admin (ID 1) tidak bisa dihapus!');
        } else {
          alert('Role Super Admin tidak bisa dihapus!');
        }
        setDeleteTarget(null);
        return;
      }

      // Cek apakah ada user aktif dengan role ini
      const isUsed = users.some((u) => u.role_id === deleteTarget.id);
      if (isUsed) {
        if (onShowToast) {
          onShowToast('warning', 'Role Sedang Digunakan', `Role '${deleteTarget.name}' masih digunakan oleh pengguna aktif.`);
        } else {
          alert(`Role '${deleteTarget.name}' masih digunakan oleh pengguna aktif!`);
        }
        setDeleteTarget(null);
        return;
      }

      setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      if (onShowToast) {
        onShowToast('success', 'Role Dihapus', `Role '${deleteTarget.name}' berhasil dihapus.`);
      }
    }

    setDeleteTarget(null);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden">
      {/* 1. CARD HEADER KDMP */}
      <div className="p-4 sm:p-5 border-b border-[#E0E0E0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#D32F2F] shrink-0 border border-red-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              User & Role
            </h5>
            <small className="text-xs text-gray-500 hidden sm:block">
              Manajemen pengguna sistem dan hak akses toko KDMP.
            </small>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={activeTab === 'users' ? 'Cari nama / username...' : 'Cari role / deskripsi...'}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      {/* 2. CARD BODY */}
      <div className="p-4 sm:p-5">
        {/* Tab Navigation (nav-tabs-kdmp) */}
        <div className="border-b border-[#E0E0E0] mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('users');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'users'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-red-50/20'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Pengguna ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('roles');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'roles'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-red-50/20'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Daftar Role ({roles.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: DAFTAR PENGGUNA (USERS)                           */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs text-gray-500">
                Total terdaftar: <strong className="text-gray-800">{users.length}</strong> akun
              </span>

              <button
                type="button"
                onClick={handleOpenAddUser}
                className="px-3.5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah User</span>
              </button>
            </div>

            {/* Table Users */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" id="table-users">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10.5px] tracking-wider">
                      <th className="py-3 px-3.5 w-12 text-center">No</th>
                      <th className="py-3 px-3.5">Nama Lengkap</th>
                      <th className="py-3 px-3.5">Username</th>
                      <th className="py-3 px-3.5">Role</th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                      <th className="py-3 px-3.5 text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">
                          Tidak ada data pengguna ditemukan.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user, idx) => (
                        <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-3.5 text-center text-gray-400 font-mono text-[11px]">
                            {startIndex + idx + 1}
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-red-100 text-[#D32F2F] font-bold text-xs flex items-center justify-center shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-gray-900 block">{user.name}</span>
                                {user.created_at && (
                                  <span className="text-[10px] text-gray-400">
                                    Dibuat: {user.created_at}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 font-mono text-gray-700">
                            @{user.username}
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              {user.role_name || 'Staff'}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                user.status === 'Aktif'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-end">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditUser(user)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit Pengguna"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'user',
                                    id: user.id,
                                    name: user.name,
                                  })
                                }
                                className={`p-1.5 rounded-lg transition-colors ${
                                  user.id === 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                                }`}
                                title={user.id === 1 ? 'Super Admin tidak bisa dihapus' : 'Hapus User'}
                                disabled={user.id === 1}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Info & Controls */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                <small id="pagination-info-users">
                  Menampilkan {totalUsers > 0 ? startIndex + 1 : 0}-
                  {Math.min(startIndex + limit, totalUsers)} dari {totalUsers} data
                </small>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white text-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-xs font-bold text-gray-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white text-gray-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DAFTAR ROLE                                       */}
        {/* ======================================================== */}
        {activeTab === 'roles' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs text-gray-500">
                Total terdaftar: <strong className="text-gray-800">{roles.length}</strong> role
              </span>

              <button
                type="button"
                onClick={handleOpenAddRole}
                className="px-3.5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Tambah Role</span>
              </button>
            </div>

            {/* Table Roles */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" id="table-roles">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10.5px] tracking-wider">
                      <th className="py-3 px-3.5 w-12 text-center">No</th>
                      <th className="py-3 px-3.5">Nama Role</th>
                      <th className="py-3 px-3.5">Deskripsi</th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                      <th className="py-3 px-3.5 text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredRoles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">
                          Tidak ada data role ditemukan.
                        </td>
                      </tr>
                    ) : (
                      filteredRoles.map((role, idx) => (
                        <tr key={role.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-3.5 text-center text-gray-400 font-mono text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="font-bold text-gray-900 block">{role.role_name}</span>
                            <span className="text-[10px] text-gray-400">
                              {users.filter((u) => u.role_id === role.id).length} Pengguna Aktif
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-gray-600 max-w-md">
                            {role.description}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                role.status === 'Aktif'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {role.status}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-end">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditRole(role)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit Role"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'role',
                                    id: role.id,
                                    name: role.role_name,
                                  })
                                }
                                className={`p-1.5 rounded-lg transition-colors ${
                                  role.id === 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                                }`}
                                title={role.id === 1 ? 'Role Super Admin tidak bisa dihapus' : 'Hapus Role'}
                                disabled={role.id === 1}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: TAMBAH / EDIT USER (#modalUser)                 */}
      {/* ======================================================== */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#D32F2F]" />
                {editingUser ? 'Edit User' : 'Tambah User'}
              </h5>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nama Lengkap <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Contoh: Rina Fitriyani"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Username <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userUsername}
                  onChange={(e) => setUserUsername(e.target.value)}
                  placeholder="Contoh: rina.kasir"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Password {!editingUser && <span className="text-[#D32F2F]">*</span>}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder={editingUser ? 'Kosongkan jika tidak ingin ganti password' : 'Wajib diisi saat tambah user'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <small className="text-gray-400 text-[10px] mt-0.5 block">
                  {editingUser
                    ? '*Biarkan kosong jika tetap menggunakan password saat ini'
                    : '*Password minimal 6 karakter, disimpan dengan enkripsi aman'}
                </small>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Role <span className="text-[#D32F2F]">*</span>
                  </label>
                  <select
                    value={userRoleId}
                    onChange={(e) => setUserRoleId(Number(e.target.value))}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    {activeRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.role_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Status</label>
                  <select
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TAMBAH / EDIT ROLE (#modalRole)                 */}
      {/* ======================================================== */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#D32F2F]" />
                {editingRole ? 'Edit Role' : 'Tambah Role'}
              </h5>
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nama Role <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Contoh: Admin Gudang"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder="Contoh: Hanya bisa akses modul gudang dan mutasi barang"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Status</label>
                <select
                  value={roleStatus}
                  onChange={(e) => setRoleStatus(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: KONFIRMASI HAPUS (DELETE MODAL)                 */}
      {/* ======================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#D32F2F] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h5 className="text-sm font-bold text-gray-900">
              Konfirmasi Hapus {deleteTarget.type === 'user' ? 'Pengguna' : 'Role'}
            </h5>

            <p className="text-xs text-gray-500">
              Apakah Anda yakin ingin menghapus {deleteTarget.type === 'user' ? 'pengguna' : 'role'}{' '}
              <strong className="text-gray-800">{deleteTarget.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-lg text-xs shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
