"use client";

import React from "react";
import { DynamicFormProps } from "./types";
import { FormFieldController } from "./FormFieldController";

export function DynamicForm<TFormValues extends Record<string, unknown> = Record<string, unknown>>({
  fields,
  values,
  onChange,
  onSubmit,
  errors = {},
  className = "space-y-4",
  gridCols = 1,
  children,
}: DynamicFormProps<TFormValues>) {
  const isGrid = gridCols > 1;

  const content = (
    <div
      className={
        isGrid
          ? `grid grid-cols-1 md:grid-cols-${gridCols} gap-4`
          : "space-y-3.5"
      }
    >
      {fields.map((field) => {
        const colSpanClass =
          field.colSpan === 2
            ? "col-span-1 md:col-span-2"
            : "col-span-1";

        return (
          <div key={field.name} className={isGrid ? colSpanClass : undefined}>
            <FormFieldController<TFormValues>
              field={field}
              value={values[field.name]}
              onChange={onChange}
              error={errors[field.name] || undefined}
              values={values}
            />
          </div>
        );
      })}
    </div>
  );

  if (onSubmit) {
    return (
      <form onSubmit={onSubmit} className={className}>
        {content}
        {children}
      </form>
    );
  }

  return (
    <div className={className}>
      {content}
      {children}
    </div>
  );
}

export default DynamicForm;
