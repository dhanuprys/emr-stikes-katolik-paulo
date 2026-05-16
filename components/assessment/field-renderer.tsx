"use client";

import { UseFormRegister, Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import type { FieldDef } from "@/lib/assessment-fields";

export function FieldRenderer({ field, register, control }: { field: FieldDef; register: UseFormRegister<any>; control: Control<any> }) {
  const required = !field.optional;

  if (field.type === "textarea") {
    return (
      <div className="space-y-2">
        <Label className="text-slate-600 font-semibold">{field.label} {required && <span className="text-destructive">*</span>}</Label>
        <Textarea {...register(field.key)} className="min-h-[80px] bg-white" />
      </div>
    );
  }

  if (field.type === "datetime" || field.type === "date") {
    return (
      <div className="space-y-2">
        <Label className="text-slate-600 font-semibold">{field.label} {required && <span className="text-destructive">*</span>}</Label>
        <Controller
          control={control}
          name={field.key}
          render={({ field: { value, onChange } }) => (
            <DatePicker 
              value={value} 
              onChange={onChange} 
              withTime={field.type === "datetime"} 
            />
          )}
        />
      </div>
    );
  }

  if (field.type === "radio" && field.options) {
    return (
      <div className="space-y-3">
        <Label className="text-slate-600 font-semibold">{field.label} {required && <span className="text-destructive">*</span>}</Label>
        <Controller
          control={control}
          name={field.key}
          render={({ field: { value, onChange } }) => (
            <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white/60">
              {field.options!.map((opt) => (
                <label key={opt} className="clinical-control-label">
                  <input
                    type="radio"
                    value={opt}
                    checked={value === opt}
                    className="clinical-radio"
                    onChange={() => onChange(opt)}
                    onClick={() => {
                      // If already selected, clicking again deselects (undo)
                      if (value === opt) onChange("");
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
        />
        {field.allowCustom && (
          <Input placeholder="Keterangan lain..." {...register(`${field.key}_custom`)} className="mt-2 bg-white" />
        )}
      </div>
    );
  }

  // text / number
  return (
    <div className="space-y-2">
      <Label className="text-slate-600 font-semibold">{field.label} {required && <span className="text-destructive">*</span>}</Label>
      <div className="flex items-center gap-3">
        <Input
          type={field.type === "number" ? "number" : "text"}
          {...register(field.key)}
          className="flex-1 bg-white"
        />
        {field.suffix && <span className="text-sm font-medium text-slate-500 shrink-0">{field.suffix}</span>}
      </div>
    </div>
  );
}
