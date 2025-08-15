import React from 'react';
import PlainTextIcon from '../../../../icon-components/PlainTextIcon';
import EmailIcon from '../../../../icon-components/EmailIcon';
import CalendarIcon from '../../../../icon-components/CalendarIcon';
import CameraIcon from '../../../../icon-components/CameraIcon';
import SelectIcon from '../../../../icon-components/SelectIcon';
import CheckboxIcon from '../../../../icon-components/CheckboxIcon';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import FileIcon from '../../../../icon-components/FileIcon';
import SignIcon from '../../../../icon-components/SignIcon';
import NumberIcon from '../../../../icon-components/Numbericon';
import UrlIcon from '../../../../icon-components/UrlIcon';
import LocationIcon from '../../../../icon-components/LocationIcon';
import RatingIcon from '../../../../icon-components/RatingIcon';
import TableIcon from '../../../../icon-components/TableIcon';

const iconTypes = new Map<string, React.ReactNode>();

iconTypes.set('PlainTextIconComponent', <PlainTextIcon fill="grey" />);
iconTypes.set('EmailIconComponent', <EmailIcon fill="grey" />);
iconTypes.set('CalendarIconComponent', <CalendarIcon fill="grey" />);
iconTypes.set('CameraIconComponent', <CameraIcon fill="grey" />);
iconTypes.set('SelectIconComponent', <SelectIcon fill="grey" />);
iconTypes.set('CheckboxIconComponent', <CheckboxIcon fill="grey" />);
iconTypes.set('RichEditorIconComponent', <RichEditorIcon fill="grey" />);
iconTypes.set('FileIconComponent', <FileIcon fill="grey" />);
iconTypes.set('SignIconComponent', <SignIcon fill="grey" />);
iconTypes.set('NumberIconComponent', <NumberIcon fill="grey" />);
iconTypes.set('UrlIconComponent', <UrlIcon fill="grey" />);
iconTypes.set('LocationIconComponent', <LocationIcon fill="grey" />);
iconTypes.set('RatingIconComponent', <RatingIcon fill="grey" />);
iconTypes.set('TableIconComponent', <TableIcon fill="grey" />);

export default iconTypes;
