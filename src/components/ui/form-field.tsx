import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string
  name: string
  type?: "text" | "textarea"
}

export function FormField({ label, type = "text", className, ...props }: FormFieldProps) {
  const id = React.useId()
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {type === "textarea" ? (
        <Textarea id={id} className={className} {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>} />
      ) : (
        <Input id={id} type="text" className={className} {...props as React.InputHTMLAttributes<HTMLInputElement>} />
      )}
    </div>
  )
} 