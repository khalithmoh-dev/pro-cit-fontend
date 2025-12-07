import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import CloseIcon from '../../../icon-components/CloseIcon';
import ArrowDownIcon from '../../../icon-components/ArrowDownIcon';
import { ModuleIF, ModulePermissions } from '../../../store/moduleStore';
import Button from '../../ButtonMui';
import '../style.css';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: { name: string; description: string; modules: ModuleIF[] }) => void;
  editRole?: {
    _id: string;
    name: string;
    description: string;
    modules: ModuleIF[];
  } | null;
  availableModules : ModuleIF[];
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSave, editRole, availableModules }) => {
  const { t } = useTranslation();
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModules, setSelectedModules] = useState<{ [key: string]: ModuleIF }>({});
  const [currentModuleKey, setCurrentModuleKey] = useState<string>('');
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({
    screen: false,
  });

  useEffect(() => {
    if (editRole) {
      setRoleName(editRole.name);
      setDescription(editRole.description);
      const modulesMap: { [key: string]: ModuleIF } = {};
      editRole.modules.forEach((module) => {
        modulesMap[module.key] = module;
      });
      setSelectedModules(modulesMap);
      setCurrentModuleKey('');
    } else {
      setRoleName('');
      setDescription('');
      setSelectedModules({});
      setCurrentModuleKey('');
    }
  }, [editRole, isOpen]);

  const handleModuleSelect = (moduleKey: string) => {
    if (!moduleKey) {
      setCurrentModuleKey('');
      return;
    }

    const module = availableModules.find(m => m.key === moduleKey);
    if (!module) return;

    setCurrentModuleKey(moduleKey);

    // If module not in selectedModules, add it with default permissions
    if (!selectedModules[moduleKey]) {
      setSelectedModules((prev) => ({
        ...prev,
        [moduleKey]: {
          ...module,
          permissions: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
        },
      }));
    }
  };

  const handlePermissionChange = (moduleKey: string, permissionType: keyof ModulePermissions) => {
    setSelectedModules((prev) => {
      const newModules = { ...prev };
      if (newModules[moduleKey]) {
        newModules[moduleKey] = {
          ...newModules[moduleKey],
          permissions: {
            ...newModules[moduleKey].permissions,
            [permissionType]: !newModules[moduleKey].permissions[permissionType],
          },
        };
      }
      return newModules;
    });
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    if (roleName.trim() && Object.keys(selectedModules).length > 0) {
      onSave({
        name: roleName.trim(),
        description: description.trim(),
        modules: Object.values(selectedModules),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setRoleName('');
    setDescription('');
    setSelectedModules({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rm-modal-overlay" onClick={handleClose}>
      <div className="rm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rm-modal-header">
          <h2 className="rm-modal-title">
            {editRole ? t('EDIT') + ' ' + t('ROLE') : t('CREATE') + ' ' + t('NEW') + ' ' + t('ROLE')}
          </h2>
          <button className="rm-modal-close-button" onClick={handleClose}>
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <div className="rm-modal-body">
          {/* Role Name Input */}
          <div className="rm-modal-input-group">
            <label className="rm-modal-label">{t('ROLE_NAME')}</label>
            <input
              type="text"
              className="rm-modal-input"
              placeholder="e.g. Teacher, Accountant"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>

          {/* Description Input */}
          <div className="rm-modal-input-group">
            <label className="rm-modal-label">{t('DESCRIPTION')}</label>
            <input
              type="text"
              className="rm-modal-input"
              placeholder="Enter role description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Screen Permissions Section */}
          <div className="rm-modal-permissions-section">
            <label className="rm-modal-label">{t('PERMISSIONS')}</label>
            <p className="rm-modal-description">
              {t('SELECT_PERMISSIONS_THAT_WILL_BE_ASSIGNED_TO_ALL_USERS_WITH_THIS_ROLE')}
            </p>

            {/* Screen Permissions */}
            <div className="rm-modal-permission-category">
              <div className="rm-modal-category-header">
                <h3 className="rm-modal-category-title">{t('SCREEN_PERMISSIONS')}</h3>
                <button
                  type="button"
                  className={`rm-modal-collapse-button ${collapsedCategories.screen ? 'collapsed' : 'expanded'}`}
                  onClick={() => toggleCategory('screen')}
                >
                  <ArrowDownIcon width={16} height={16} />
                </button>
              </div>
              <div className={`rm-modal-permission-grid-wrapper ${collapsedCategories.screen ? 'collapsed' : 'expanded'}`}>
                {/* Select Dropdown */}
                <div className="rm-modal-select-wrapper">
                  <select
                    className="rm-modal-select"
                    value={currentModuleKey}
                    onChange={(e) => handleModuleSelect(e.target.value)}
                  >
                    <option value="">Select a screen...</option>
                    {availableModules.map((module) => (
                      <option key={module.key} value={module.key}>
                        {module.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Show CRUD permissions only for currently selected module */}
                {currentModuleKey && selectedModules[currentModuleKey] && (
                  <div className="rm-modal-module-item">
                    <div className="rm-modal-module-header">
                      <span className="rm-modal-module-name">{selectedModules[currentModuleKey].name}</span>
                    </div>

                    <div className="rm-modal-crud-permissions">
                      <label className="rm-modal-crud-label">
                        <input
                          type="checkbox"
                          checked={selectedModules[currentModuleKey].permissions.create}
                          onChange={() => handlePermissionChange(currentModuleKey, 'create')}
                          className="rm-modal-crud-checkbox"
                        />
                        <span>{t('CREATE')}</span>
                      </label>
                      <label className="rm-modal-crud-label">
                        <input
                          type="checkbox"
                          checked={selectedModules[currentModuleKey].permissions.read}
                          onChange={() => handlePermissionChange(currentModuleKey, 'read')}
                          className="rm-modal-crud-checkbox"
                        />
                        <span>{t('READ')}</span>
                      </label>
                      <label className="rm-modal-crud-label">
                        <input
                          type="checkbox"
                          checked={selectedModules[currentModuleKey].permissions.update}
                          onChange={() => handlePermissionChange(currentModuleKey, 'update')}
                          className="rm-modal-crud-checkbox"
                        />
                        <span>{t('UPDATE')}</span>
                      </label>
                      <label className="rm-modal-crud-label">
                        <input
                          type="checkbox"
                          checked={selectedModules[currentModuleKey].permissions.delete}
                          onChange={() => handlePermissionChange(currentModuleKey, 'delete')}
                          className="rm-modal-crud-checkbox"
                        />
                        <span>{t('DELETE')}</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rm-modal-footer">
          <Button 
          sizeType="md"
          variantType="cancel"
          onClick={handleClose}>
            {t('CANCEL')}
          </Button>
          <Button
            sizeType="md"
            variantType="model-add"
            onClick={handleSave}
            disabled={!roleName.trim() || Object.keys(selectedModules).length === 0}
          >
            {editRole ? t('UPDATE') + ' ' + t('ROLE') : t('CREATE') + ' ' + t('ROLE')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
