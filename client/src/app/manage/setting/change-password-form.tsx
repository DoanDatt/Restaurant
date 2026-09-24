'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm, Controller } from 'react-hook-form'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useChangePasswordMutation } from '@/queries/useAccount'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'

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
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='grid auto-rows-max items-start gap-4 md:gap-8'>
      <Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <div className='grid gap-3'>
              <Label htmlFor='oldPassword'>Mật khẩu cũ</Label>
              <Controller
                control={form.control}
                name='oldPassword'
                render={({ field, fieldState }) => (
                  <>
                    <Input id='oldPassword' type='password' className='w-full' {...field} />
                    {fieldState.invalid && (
                      <p className='text-sm font-medium text-destructive'>{fieldState.error?.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='password'>Mật khẩu mới</Label>
              <Controller
                control={form.control}
                name='password'
                render={({ field, fieldState }) => (
                  <>
                    <Input id='password' type='password' className='w-full' {...field} />
                    {fieldState.invalid && (
                      <p className='text-sm font-medium text-destructive'>{fieldState.error?.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='confirmPassword'>Nhập lại mật khẩu mới</Label>
              <Controller
                control={form.control}
                name='confirmPassword'
                render={({ field, fieldState }) => (
                  <>
                    <Input id='confirmPassword' type='password' className='w-full' {...field} />
                    {fieldState.invalid && (
                      <p className='text-sm font-medium text-destructive'>{fieldState.error?.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className='items-center gap-2 md:ml-auto flex'>
              <Button type='button' variant='outline' size='sm'>
                Hủy
              </Button>
              <Button type='submit' size='sm'>
                Lưu thông tin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
