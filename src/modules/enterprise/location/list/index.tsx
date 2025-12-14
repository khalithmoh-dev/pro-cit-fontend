import React, { useEffect, useState } from 'react';
import DataTable from '../../../common/generic-table';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useLocationStore from "../../../../store/locationStore";
import { t } from 'i18next';
import Icon from '../../../../components/Icons';

const LocationList: React.FC = () => {
    const navigate = useNavigate();
    const { getLocations } = useLocationStore();
    const [locationList, setLocationList] = useState([]);

    // Column configuration
    const columns = [
        {
            field: 'locationCd',
            headerName: t("LOCATION_CODE"),
            sortable: true
        },
        {
            field: 'locationNm',
            headerName: t("LOCATION_NAME"),
            sortable: true,
        },
        {
            field: 'campusNm',
            headerName: t("CAMPUS"),
            sortable: true,
        },
        {
            field: 'facilityNm',
            headerName: t("FACILITY"),
            sortable: true,
        },
        {
            field: 'locationType',
            headerName: t("TYPE"),
            sortable: true,
        },
        {
            field: 'capacity',
            headerName: t("CAPACITY"),
            sortable: true,
        }
    ];

    // Action buttons
    const actions = [
        {
            label: 'View Details',
            icon: <Icon size={18} name="Eye"/>,
            onClick: (row) => {
                navigate('/location/form/' + row._id);
            }
        }
    ];

    useEffect(() => {
        if (getLocations) {
          (async () => {
            try {
              const aLocationRes = await getLocations();
              if (Array.isArray(aLocationRes?.data) && aLocationRes?.data?.length) {
                setLocationList(aLocationRes?.data);
              }
            } catch (error) {
              console.error("Failed to fetch locations:", error);
            }
          })();
        }
    }, [getLocations]);

    return (
        <Box sx={{ p: 3 }}>
            <DataTable
                data={locationList}
                columns={columns}
                addRoute = {'/location/form'}
                title={t("LOCATIONS")}
                actions={actions}
            />
        </Box>
    );
};

export default LocationList;
