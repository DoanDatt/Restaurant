'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Loader2 } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useChangePasswordMutation } from '@/queries/useAccount'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'

const fields: { name: keyof ChangePasswordBodyType; label: string; autoComplete: string }[] = [
  { name: 'oldPassword', label: 'Mật khẩu hiện tại', autoComplete: 'current-password' },
  { name: 'password', label: 'Mật khẩu mới', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'Nhập lại mật khẩu mới', autoComplete: 'new-password' }
]

export default function ChangePasswordForm() {
  const changePasswordMutation = useChangePasswordMutation()
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: ChangePasswordBodyType) => {
    if (changePasswordMutation.isPending) return
    try {
      const result = await changePasswordMutation.mutateAsync(data)
      toast('Success', {
        description: result.payload.message
      })
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} onReset={() => form.reset()}>
      <Card>
        <CardHeader className='-mt-4 border-b bg-linear-to-r from-emerald-500/15 via-emerald-500/5 to-transparent pt-4'>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>Sau khi đổi, hãy dùng mật khẩu mới cho lần đăng nhập tiếp theo.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className='gap-5'>
            {fields.map(({ name, label, autoComplete }) => (
              <Controller
                key={name}
                control={form.control}
                name={name}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    <Input
                      id={name}
                      type='password'
                      autoComplete={autoComplete}
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            ))}
          </FieldGroup>
        </CardContent>
        <CardFooter className='justify-end gap-2'>
          <Button type='reset' variant='ghost'>
            Hủy
          </Button>
          <Button type='submit' disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending && <Loader2 className='animate-spin' />}
            Đổi mật khẩu
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
