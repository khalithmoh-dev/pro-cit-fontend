import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import RichEditorIcon from '../../icon-components/RichEditor';
import DeleteIcon from '../../icon-components/DeleteIcon';
import useRoleStore, { roleIF } from '../../store/roleStore';
import PlusIcon from '../../icon-components/PlusIcon';
import RoleModal from '../../components/modal/Role-Modal/RoleModal';
import  useModuleStore, { ModuleIF } from '../../store/moduleStore';
import { useToastStore } from '../../store/toastStore';

const RolesPage: React.FC = () => {
  const { t } = useTranslation();
  const { getRolesByInstId, createRole, updateRole, deleteRole: deleteRoleAPI } = useRoleStore();
  const { modules: availableModules, getModules } = useModuleStore();
  const { showToast } = useToastStore();
  const [roles, setRoles] = useState<roleIF[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<roleIF | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchRoles = async () => {
    const result = await getRolesByInstId();
    if (result && typeof result !== 'boolean') {
      setRoles(result.roles);
    }
  }

  useEffect(() => {
    fetchRoles();
    getModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateRole = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (_id: string) => {
    const role = roles.find((r) => r._id === _id);
    if (role) {
      setEditingRole(role);
      setIsModalOpen(true);
    }
  };

  const handleSaveRole = async (roleData: { name: string; description: string; modules: ModuleIF[] }) => {
    try {
      if (editingRole) {
        // Update existing role
        const success = await updateRole(roleData, editingRole._id);
        if (success) {
          showToast('success', t('UPDATED_SUCCESSFULLY'));
          fetchRoles();
        } else {
          showToast('error', t('FAILED_TO_UPDATE'));
        }
      } else {
        // Create new role
        const success = await createRole(roleData);
        if (success) {
          showToast('success', t('CREATED_SUCCESSFULLY'));
          fetchRoles();
        } else {
          showToast('error', t('FAILED_TO_CREATE'));
        }
      }
      setIsModalOpen(false);
      setEditingRole(null);
    } catch {
      showToast('error', t('UNKNOWN_ERROR_OCCURRED'));
    }
  };

  const handleDeleteRole = async (_id: string) => {
    if (deleteConfirmId === _id) {
      const success = await deleteRoleAPI(_id);
      if (success) {
        showToast('success', 'Role deleted successfully');
        fetchRoles();
      } else {
        showToast('error', 'Failed to delete role');
      }
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(_id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  return (
    <div className="rm-container">
      <div className="rm-header">
        <div className="rm-header-text">
          <h1 className="rm-title">{t("ROLE_MANAGEMENT")}</h1>
          <p className="rm-subtitle">{t("DEFINE_ROLES_WITH_PRESET_PERMISSION")}</p>
        </div>
        <button className="rm-create-button" onClick={handleCreateRole}>
          <PlusIcon fill="white" width={18} height={18} />
          {t("CREATE") + " " + t("ROLE")}
        </button>
      </div>

      <div className="rm-grid">
        {roles.map((role) => (
          <div key={role._id} className="rm-card">
            <div className="rm-card-header">
              <div className="rm-role-info">
                <h3 className="rm-role-title">{role.name}</h3>
                <p className="rm-permission-count">{role.modules.length} {t("PERMISSIONS")}</p>
              </div>
              <div className="rm-actions">
                <button
                  className="rm-action-button"
                  onClick={() => handleEditRole(role._id)}
                  title="Edit role"
                >
                  <RichEditorIcon width={16} height={16} />
                </button>
                <button
                  className={`rm-action-button ${deleteConfirmId === role._id ? 'rm-delete-confirm' : ''}`}
                  onClick={() => handleDeleteRole(role._id)}
                  title={deleteConfirmId === role._id ? 'Click again to confirm' : 'Delete role'}
                >
                  <DeleteIcon width={16} height={16} />
                </button>
              </div>
            </div>

            <div className="rm-permission-tags">
              {role.modules.slice(0, 5).map((module) => (
                <span key={module.key} className="rm-tag">
                  {module.name}
                </span>
              ))}
              {role.modules.length > 5 && (
                <span className="rm-more-tag">+{role.modules.length - 5} {t("MORE")}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRole(null);
        }}
        onSave={handleSaveRole}
        editRole={editingRole}
        availableModules={availableModules}
      />
    </div>
  );
};

export default RolesPage;
