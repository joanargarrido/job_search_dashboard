"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  JobApplicationStatus,
  jobApplicationStatuses,
  type JobApplication,
} from "@/app/board/components/types";

const newJobSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  role: z.string().trim().min(1, "Role is required"),
  salary: z.number().positive("Salary must be a positive number"),
  dateApplied: z.string().min(1, "Date applied is required"),
  notes: z.string(),
  status: z.enum(JobApplicationStatus),
});

type NewJobFormValues = z.infer<typeof newJobSchema>;

interface NewJobModalProps {
  onClose: () => void;
  onCreate: (application: JobApplication) => void;
}

export function NewJobModal({ onClose, onCreate }: NewJobModalProps) {
  const companyInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewJobFormValues>({
    resolver: zodResolver(newJobSchema),
    defaultValues: {
      companyName: "",
      role: "",
      salary: undefined,
      dateApplied: new Date().toISOString().slice(0, 10),
      notes: "",
      status: JobApplicationStatus.WISHLIST,
    },
  });
  const companyNameRegistration = register("companyName");

  useEffect(() => {
    companyInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function submitApplication(values: NewJobFormValues) {
    onCreate(values);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-job-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="new-job-title" className="text-lg font-semibold">
              New Job
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Add a role to your application board.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(submitApplication)}
          className="space-y-4"
        >
          <FormField
            id="companyName"
            label="Company name"
            error={errors.companyName?.message}
          >
            <input
              {...companyNameRegistration}
              ref={(element) => {
                companyNameRegistration.ref(element);
                companyInputRef.current = element;
              }}
              id="companyName"
              aria-invalid={Boolean(errors.companyName)}
              aria-describedby={
                errors.companyName ? "companyName-error" : undefined
              }
              autoComplete="organization"
              className={inputClassName}
            />
          </FormField>

          <FormField id="role" label="Role" error={errors.role?.message}>
            <input
              {...register("role")}
              id="role"
              aria-invalid={Boolean(errors.role)}
              aria-describedby={errors.role ? "role-error" : undefined}
              autoComplete="organization-title"
              className={inputClassName}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="salary"
              label="Salary (USD)"
              error={errors.salary?.message}
            >
              <input
                {...register("salary", { valueAsNumber: true })}
                id="salary"
                type="number"
                min="0.01"
                step="any"
                aria-invalid={Boolean(errors.salary)}
                aria-describedby={errors.salary ? "salary-error" : undefined}
                className={inputClassName}
              />
            </FormField>

            <FormField
              id="dateApplied"
              label="Date applied"
              error={errors.dateApplied?.message}
            >
              <input
                {...register("dateApplied")}
                id="dateApplied"
                type="date"
                aria-invalid={Boolean(errors.dateApplied)}
                aria-describedby={
                  errors.dateApplied ? "dateApplied-error" : undefined
                }
                className={inputClassName}
              />
            </FormField>
          </div>

          <FormField id="status" label="Status" error={errors.status?.message}>
            <select
              {...register("status")}
              id="status"
              aria-invalid={Boolean(errors.status)}
              aria-describedby={errors.status ? "status-error" : undefined}
              className={inputClassName}
            >
              {jobApplicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="notes" label="Notes" error={errors.notes?.message}>
            <textarea
              {...register("notes")}
              id="notes"
              rows={3}
              aria-invalid={Boolean(errors.notes)}
              aria-describedby={errors.notes ? "notes-error" : undefined}
              className={inputClassName}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Add job
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

const inputClassName =
  "mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
