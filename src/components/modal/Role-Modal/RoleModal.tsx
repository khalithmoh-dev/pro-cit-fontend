import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Box, IconButton } from '@mui/material';
import CloseIcon from '../../../icon-components/CloseIcon';
import ArrowDownIcon from '../../../icon-components/ArrowDownIcon';
import { ModuleIF, ModulePermissions } from '../../../store/moduleStore';
import Button from '../../ButtonMui';
import FormLabel from '../../Label';
import InputFields from '../../inputFields';
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
    <Box className="rm-modal-overlay" onClick={handleClose}>
      <Box className="rm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rm-modal-header">
          <h2 className="rm-modal-title">
            {editRole ? t('EDIT') + ' ' + t('ROLE') : t('CREATE') + ' ' + t('NEW') + ' ' + t('ROLE')}
          </h2>
          <IconButton className="rm-modal-close-button" onClick={handleClose}>
            <CloseIcon width={20} height={20} />
          </IconButton>
        </div>

        <Box className="rm-modal-body">
          <div className="rm-modal-input-group">
            <FormLabel labelName={t('ROLE_NAME')} className="rm-modal-label" />
            <InputFields
              field={{
                type: 'text',
                name: 'roleName',
                placeholder: 'e.g. Teacher, Accountant'
              }}
              editPerm={true}
              value={roleName}
              onChange={(name, value) => setRoleName(value)}
            />
          </div>

          <div className="rm-modal-input-group">
            <FormLabel labelName={t('DESCRIPTION')} className="rm-modal-label" />
            <InputFields
              field={{
                type: 'text',
                name: 'description',
                placeholder: 'Enter role description'
              }}
              editPerm={true}
              value={description}
              onChange={(name, value) => setDescription(value)}
            />
          </div>

          <Box className="rm-modal-permissions-section">
            <FormLabel labelName={t('PERMISSIONS')} className="rm-modal-label" />
            <p className="rm-modal-description">
              {t('SELECT_PERMISSIONS_THAT_WILL_BE_ASSIGNED_TO_ALL_USERS_WITH_THIS_ROLE')}
            </p>

            <Box className="rm-modal-permission-category">
              <div className="rm-modal-category-header">
                <h3 className="rm-modal-category-title">{t('SCREEN_PERMISSIONS')}</h3>
                <IconButton
                  type="button"
                  className={`rm-modal-collapse-button ${collapsedCategories.screen ? 'collapsed' : 'expanded'}`}
                  onClick={() => toggleCategory('screen')}
                >
                  <ArrowDownIcon width={16} height={16} />
                </IconButton>
              </div>
              <Box className={`rm-modal-permission-grid-wrapper ${collapsedCategories.screen ? 'collapsed' : 'expanded'}`}>
                <Box className="rm-modal-select-wrapper">
                  <InputFields
                    field={{
                      type: 'select',
                      name: 'moduleKey',
                      options: availableModules.map(module => ({
                        value: module.key,
                        label: module.name
                      })),
                      labelKey: 'label',
                      valueKey: 'value',
                      MenuProps: {
                        disablePortal: false,
                        style: { zIndex: 10001 },
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          }
                        }
                      }
                    }}
                    editPerm={true}
                    value={currentModuleKey}
                    onChange={(name, value) => handleModuleSelect(value)}
                  />
                </Box>

                {currentModuleKey && selectedModules[currentModuleKey] && (
                  <Box className="rm-modal-module-item">
                    <Box className="rm-modal-module-header">
                      <span className="rm-modal-module-name">{selectedModules[currentModuleKey].name}</span>
                    </Box>

                    <div className="rm-modal-crud-permissions">
                      <Box className="rm-modal-crud-label">
                        <InputFields
                          field={{
                            type: 'checkbox',
                            name: 'create',
                            label: t('CREATE')
                          }}
                          editPerm={true}
                          value={selectedModules[currentModuleKey].permissions.create}
                          onChange={() => handlePermissionChange(currentModuleKey, 'create')}
                        />
                      </Box>
                      <Box className="rm-modal-crud-label">
                        <InputFields
                          field={{
                            type: 'checkbox',
                            name: 'read',
                            label: t('READ')
                          }}
                          editPerm={true}
                          value={selectedModules[currentModuleKey].permissions.read}
                          onChange={() => handlePermissionChange(currentModuleKey, 'read')}
                        />
                      </Box>
                      <Box className="rm-modal-crud-label">
                        <InputFields
                          field={{
                            type: 'checkbox',
                            name: 'update',
                            label: t('UPDATE')
                          }}
                          editPerm={true}
                          value={selectedModules[currentModuleKey].permissions.update}
                          onChange={() => handlePermissionChange(currentModuleKey, 'update')}
                        />
                      </Box>
                      <Box className="rm-modal-crud-label">
                        <InputFields
                          field={{
                            type: 'checkbox',
                            name: 'delete',
                            label: t('DELETE')
                          }}
                          editPerm={true}
                          value={selectedModules[currentModuleKey].permissions.delete}
                          onChange={() => handlePermissionChange(currentModuleKey, 'delete')}
                        />
                      </Box>
                    </div>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

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
      </Box>
    </Box>
  );
};

export default RoleModal;
