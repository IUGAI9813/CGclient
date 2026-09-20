"use client";

import React from "react";
import { FormFieldControllerProps } from "./types";
import { AlertCircle } from "lucide-react";

export function FormFieldController<TFormValues extends Record<string, unknown> = Record<string, unknown>>({
  field,
  value,
  onChange,
  error,
  values = {} as TFormValues,
}: FormFieldControllerProps<TFormValues>) {
  const {
    name,
    label,
    type,
    placeholder,
    required,
    disabled,
    readOnly,
    options = [],
    rows = 3,
    className = "",
    containerClassName = "",
    helperText,
    icon: Icon,
    rangeNames,
    rangePlaceholders,
    rangeLabels,
    render,
  } = field;

  const fieldError = error || field.error;

  const baseInputStyles =
    "w-full bg-[#080e1c] border border-slate-700/80 rounded-md px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-sky-400 disabled:opacity-50 disabled:cursor-not-allowed";

  const renderField = () => {
    switch (type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <div className="relative flex items-center">
            {Icon && (
              <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <input
              id={name}
              name={name}
              type={type}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              value={value !== undefined && value !== null ? String(value) : ""}
              onChange={(e) =>
                onChange(
                  name,
                  type === "number"
                    ? e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                    : e.target.value
                )
              }
              className={`${baseInputStyles} ${Icon ? "pl-9" : ""} ${
                type === "password" ? "font-mono" : ""
              } ${fieldError ? "border-brand-rose focus:border-brand-rose" : ""} ${className}`}
            />
          </div>
        );

      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            rows={rows}
            value={value !== undefined && value !== null ? String(value) : ""}
            onChange={(e) => onChange(name, e.target.value)}
            className={`${baseInputStyles} resize-none ${
              fieldError ? "border-brand-rose focus:border-brand-rose" : ""
            } ${className}`}
          />
        );

      case "select":
        return (
          <select
            id={name}
            name={name}
            required={required}
            disabled={disabled}
            value={value !== undefined && value !== null ? String(value) : ""}
            onChange={(e) => onChange(name, e.target.value)}
            className={`${baseInputStyles} cursor-pointer ${
              fieldError ? "border-brand-rose focus:border-brand-rose" : ""
            } ${className}`}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={String(opt.value)}
                value={String(opt.value)}
                disabled={opt.disabled}
                className="bg-[#0c1427] text-slate-100"
              >
                {typeof opt.label === "string" ? opt.label : String(opt.value)}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <label className="flex items-start gap-2.5 cursor-pointer select-none group">
            <input
              id={name}
              name={name}
              type="checkbox"
              required={required}
              disabled={disabled}
              checked={Boolean(value)}
              onChange={(e) => onChange(name, e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border border-slate-700 bg-[#080e1c] text-sky-500 focus:ring-sky-400 focus:ring-offset-0 transition-colors cursor-pointer"
            />
            <div className="flex flex-col">
              {label && (
                <span className="text-xs text-slate-200 group-hover:text-white transition-colors">
                  {label}
                  {required && <span className="text-brand-rose ml-1">*</span>}
                </span>
              )}
              {helperText && (
                <span className="text-[11px] text-slate-400">{helperText}</span>
              )}
            </div>
          </label>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {options.map((opt) => (
              <label
                key={String(opt.value)}
                className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                  value === opt.value
                    ? "bg-sky-500/10 border-sky-500/40 text-sky-300"
                    : "bg-[#080e1c] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                } ${opt.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name={name}
                  value={String(opt.value)}
                  disabled={opt.disabled || disabled}
                  checked={value === opt.value}
                  onChange={() => onChange(name, opt.value)}
                  className="mt-0.5 text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{opt.label}</span>
                  {opt.description && (
                    <span className="text-[10px] text-slate-400">
                      {opt.description}
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        );

      case "date":
      case "time":
      case "datetime-local":
        return (
          <input
            id={name}
            name={name}
            type={type}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            value={value !== undefined && value !== null ? String(value) : ""}
            onChange={(e) => onChange(name, e.target.value)}
            className={`${baseInputStyles} ${
              fieldError ? "border-brand-rose focus:border-brand-rose" : ""
            } ${className}`}
          />
        );

      case "date-range":
      case "datetime-range": {
        const inputType = type === "date-range" ? "date" : "datetime-local";
        const startName = rangeNames?.[0] || `${name}_start`;
        const endName = rangeNames?.[1] || `${name}_end`;

        const valObj =
          typeof value === "object" && value !== null
            ? (value as Record<string, unknown>)
            : null;
        const formObj = values as Record<string, unknown>;

        const startVal = valObj
          ? String(valObj.start ?? valObj[startName] ?? "")
          : String(formObj[startName] ?? "");
        const endVal = valObj
          ? String(valObj.end ?? valObj[endName] ?? "")
          : String(formObj[endName] ?? "");

        const handleRangeChange = (targetName: string, targetKey: "start" | "end", val: string) => {
          if (rangeNames) {
            onChange(targetName, val);
          } else {
            const nextVal: Record<string, unknown> = valObj ? { ...valObj } : {};
            nextVal[targetKey] = val;
            onChange(name, nextVal);
          }
        };

        return (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              {rangeLabels?.[0] && (
                <span className="text-[10px] text-slate-400 block font-medium">
                  {rangeLabels[0]}
                </span>
              )}
              <input
                type={inputType}
                placeholder={rangePlaceholders?.[0] || "Start"}
                value={startVal}
                disabled={disabled}
                onChange={(e) => handleRangeChange(startName, "start", e.target.value)}
                className={`${baseInputStyles} ${className}`}
              />
            </div>
            <div className="space-y-1">
              {rangeLabels?.[1] && (
                <span className="text-[10px] text-slate-400 block font-medium">
                  {rangeLabels[1]}
                </span>
              )}
              <input
                type={inputType}
                placeholder={rangePlaceholders?.[1] || "End"}
                value={endVal}
                disabled={disabled}
                onChange={(e) => handleRangeChange(endName, "end", e.target.value)}
                className={`${baseInputStyles} ${className}`}
              />
            </div>
          </div>
        );
      }

      case "custom":
        if (render) {
          return render({
            field,
            value,
            onChange: (val) => onChange(name, val),
            values,
          });
        }
        return null;

      default:
        return null;
    }
  };

  // For standalone checkbox, the label is rendered beside the input
  if (type === "checkbox") {
    return (
      <div className={`space-y-1 ${containerClassName}`}>
        {renderField()}
        {fieldError && (
          <p className="text-[11px] text-brand-rose flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{fieldError}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium text-slate-200 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-brand-rose ml-1">*</span>}
          </span>
        </label>
      )}

      {renderField()}

      {helperText && !fieldError && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}

      {fieldError && (
        <p className="text-[11px] text-brand-rose flex items-center gap-1 mt-1 animate-fade-in">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{fieldError}</span>
        </p>
      )}
    </div>
  );
}

export default FormFieldController;
