import { FieldIF } from '../../../../interface/component.interface';

export interface StateIF {
  showInputType: boolean;
  createDialog: boolean;
  importDialog: boolean;
  previewDialog: boolean;
  showSettings: number;
  fields: FieldIF[];
  formName: string;
  selectedTemplate: any;
  templates: any[];
  existingForm: any;
}
