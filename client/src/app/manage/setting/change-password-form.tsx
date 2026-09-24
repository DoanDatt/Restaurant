'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm, Controller } from 'react-hook-form'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'

export default function ChangePasswordForm() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = (data: ChangePasswordBodyType) => {
    console.log(data)
    // TODO: gọi API đổi mật khẩu ở đây
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className='grid auto-rows-max items-start gap-4 md:gap-8'>
      <Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <div className='grid gap-3'>
              <Label htmlFor='oldPassword'>Mật khẩu cũ</Label>
              <Controller
                control={control}
                name='oldPassword'
                render={({ field }) => <Input id='oldPassword' type='password' className='w-full' {...field} />}
              />
              {errors.oldPassword && (
                <p className='text-sm font-medium text-destructive'>{errors.oldPassword.message}</p>
              )}
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='password'>Mật khẩu mới</Label>
              <Controller
                control={control}
                name='password'
                render={({ field }) => <Input id='password' type='password' className='w-full' {...field} />}
              />
              {errors.password && <p className='text-sm font-medium text-destructive'>{errors.password.message}</p>}
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='confirmPassword'>Nhập lại mật khẩu mới</Label>
              <Controller
                control={control}
                name='confirmPassword'
                render={({ field }) => <Input id='confirmPassword' type='password' className='w-full' {...field} />}
              />
              {errors.confirmPassword && (
                <p className='text-sm font-medium text-destructive'>{errors.confirmPassword.message}</p>
              )}
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
