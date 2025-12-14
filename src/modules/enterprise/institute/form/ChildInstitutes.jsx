import Popup from "../../../../components/modal";
import { useTranslation } from "react-i18next";
import './ChildInstitutes.css';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const ViewInstitutes = ({ isModalOpen, aChildIns, setIsModalOpen, onAddInstitution, onSwitchInstitute }) => {
    const { t } = useTranslation();
    const actions = [{
        size: 'sm',
        onClick: () => {
            if (onAddInstitution) {
                onAddInstitution();
            }
        },
        type: 'button',
        disabled: false,
        variant: 'primary',
        label: t('ADD_INSTITUTIONS')
    }];

    return (
      <Popup
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('INSTITUTIONS')}
        maxWidth="md"
        actions={actions}
      >
        {aChildIns.length > 0 ? (
          <List>
            {aChildIns.map((inst) => (
              <ListItem
                key={inst._id}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="switch"
                    onClick={() => onSwitchInstitute && onSwitchInstitute(inst?._id)}
                    color="primary"
                  >
                    <SwapHorizIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <SchoolIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={inst.insName} secondary={`Institute Code: ${inst.insCode}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          <p className="text-center my-3">{t('NO_CHILD_INSTITUTES')}</p>
        )}
      </Popup>
    );
}
export default ViewInstitutes;