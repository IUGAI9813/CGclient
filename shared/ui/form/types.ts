import React from "react";

export type FormFieldValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | null
  | undefined;

export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "datetime-local"
  | "date-range"
  | "datetime-range"
  | "custom";

export interface FormFieldOption {
  label: React.ReactNode;
  value: string | number;
  description?: string;
  disabled?: boolean;
}

export interface FormFieldConfig<TFormValues = Record<string, unknown>> {
  name: string;
  label?: React.ReactNode;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  options?: FormFieldOption[];
  rows?: number; // For textarea
  colSpan?: 1 | 2; // For grid columns
  className?: string;
  containerClassName?: string;
  helperText?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  
  // For two-input date/time ranges (e.g. [startDate, endDate])
  rangeNames?: [string, string];
  rangePlaceholders?: [string, string];
  rangeLabels?: [string, string];
  
  // Custom render prop if type is 'custom'
  render?: (props: {
    field: FormFieldConfig<TFormValues>;
    value: unknown;
    onChange: (value: unknown) => void;
    values: TFormValues;
  }) => React.ReactNode;
}

export interface FormFieldControllerProps<TFormValues = Record<string, unknown>> {
  field: FormFieldConfig<TFormValues>;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
  error?: string;
  values?: TFormValues;
}

export interface DynamicFormProps<TFormValues = Record<string, unknown>> {
  fields: FormFieldConfig<TFormValues>[];
  values: TFormValues;
  onChange: (name: string, value: unknown) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  errors?: Record<string, string | null | undefined>;
  className?: string;
  gridCols?: 1 | 2;
  children?: React.ReactNode;
}
