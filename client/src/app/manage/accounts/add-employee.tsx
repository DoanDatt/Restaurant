'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CreateEmployeeAccountBody, CreateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const fields: { name: 'name' | 'email' | 'password' | 'confirmPassword'; label: string; type: string }[] = [
  { name: 'name', label: 'Tên', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Mật khẩu', type: 'password' },
  { name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password' }
]

export default function AddEmployee() {
  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const form = useForm<CreateEmployeeAccountBodyType>({
    resolver: zodResolver(CreateEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '',
      avatar: undefined,
      password: '',
      confirmPassword: ''
    }
  })
  const avatar = form.watch('avatar')
  const name = form.watch('name')
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [file, avatar])

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo tài khoản</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-150 max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' id='add-employee-form'>
          <FieldGroup className='gap-4 py-4'>
            <Controller
              control={form.control}
              name='avatar'
              render={({ field }) => (
                <Field>
                  <div className='flex gap-2 items-start justify-start'>
                    <Avatar className='aspect-square w-25 h-25 rounded-md object-cover'>
                      <AvatarImage src={previewAvatarFromFile} />
                      <AvatarFallback className='rounded-none'>{name || 'Avatar'}</AvatarFallback>
                    </Avatar>
                    <input
                      type='file'
                      accept='image/*'
                      ref={avatarInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setFile(file)
                          field.onChange('http://localhost:3000/' + file.name)
                        }
                      }}
                      className='hidden'
                    />
                    <button
                      className='flex aspect-square w-25 items-center justify-center rounded-md border border-dashed'
                      type='button'
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <Upload className='h-4 w-4 text-muted-foreground' />
                      <span className='sr-only'>Upload</span>
                    </button>
                  </div>
                </Field>
              )}
            />

            {fields.map(({ name, label, type }) => (
              <Controller
                key={name}
                control={form.control}
                name={name}
                render={({ field, fieldState }) => (
                  <Field orientation='horizontal' data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name} className='w-1/4 shrink-0'>
                      {label}
                    </FieldLabel>
                    <FieldContent>
                      <Input id={name} type={type} aria-invalid={fieldState.invalid} {...field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                  </Field>
                )}
              />
            ))}
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type='submit' form='add-employee-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
