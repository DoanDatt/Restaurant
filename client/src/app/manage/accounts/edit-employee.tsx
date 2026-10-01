'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { UpdateEmployeeAccountBody, UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'

const infoFields: { name: 'name' | 'email'; label: string; type: string }[] = [
  { name: 'name', label: 'Tên', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' }
]

const passwordFields: { name: 'password' | 'confirmPassword'; label: string }[] = [
  { name: 'password', label: 'Mật khẩu mới' },
  { name: 'confirmPassword', label: 'Xác nhận mật khẩu mới' }
]

export default function EditEmployee({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '',
      avatar: undefined,
      password: undefined,
      confirmPassword: undefined,
      changePassword: false
    }
  })
  const avatar = form.watch('avatar')
  const name = form.watch('name')
  const changePassword = form.watch('changePassword')
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [file, avatar])

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined)
        }
      }}
    >
      <DialogContent className='sm:max-w-150 max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' id='edit-employee-form'>
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

            {infoFields.map(({ name, label, type }) => (
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

            <Controller
              control={form.control}
              name='changePassword'
              render={({ field, fieldState }) => (
                <Field orientation='horizontal' data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='changePassword' className='w-1/4 shrink-0'>
                    Đổi mật khẩu
                  </FieldLabel>
                  <FieldContent>
                    <Switch id='changePassword' checked={field.value} onCheckedChange={field.onChange} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            {changePassword &&
              passwordFields.map(({ name, label }) => (
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
                        <Input
                          id={name}
                          type='password'
                          aria-invalid={fieldState.invalid}
                          {...field}
                          value={field.value ?? ''}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </FieldContent>
                    </Field>
                  )}
                />
              ))}
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type='submit' form='edit-employee-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
