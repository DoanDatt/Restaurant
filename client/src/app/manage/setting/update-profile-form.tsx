'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAccountProfile } from '@/queries/useAccount'

export default function UpdateProfileForm() {
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { data } = useAccountProfile()

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: ''
    }
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = form

  const name = watch('name')
  const avatar = watch('avatar')

  useEffect(() => {
    if (data) {
      const { name, avatar } = data.payload.data
      form.reset({
        name,
        avatar: avatar ?? ''
      })
    }
  }, [form, data])

  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [avatar, file])

  const onSubmit = (formData: UpdateMeBodyType) => {
    console.log(formData, file)
    // TODO: gọi API update profile ở đây (kèm upload file nếu có)
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className='grid auto-rows-max items-start gap-4 md:gap-8'>
      <Card x-chunk='dashboard-07-chunk-0'>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <Controller
              control={control}
              name='avatar'
              render={({ field, fieldState }) => (
                <div className='flex flex-col gap-2 items-start justify-start'>
                  <div className='flex gap-2 items-start justify-start'>
                    <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                      <AvatarImage src={previewAvatar} />
                      <AvatarFallback className='rounded-none'>{name || 'Avatar'}</AvatarFallback>
                    </Avatar>
                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      ref={avatarInputRef}
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0]
                        if (selectedFile) {
                          setFile(selectedFile)
                          // Lưu tạm url/tên file vào field nếu cần, tuỳ schema của bạn
                          field.onChange(URL.createObjectURL(selectedFile))
                        }
                      }}
                    />
                    <button
                      className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                      type='button'
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <Upload className='h-4 w-4 text-muted-foreground' />
                      <span className='sr-only'>Upload</span>
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <p className='text-sm font-medium text-destructive'>{fieldState.error?.message}</p>
                  )}
                </div>
              )}
            />

            <div className='grid gap-3'>
              <Label htmlFor='name'>Tên</Label>
              <Controller
                control={control}
                name='name'
                render={({ field }) => <Input id='name' type='text' className='w-full' {...field} />}
              />
              {errors.name && <p className='text-sm font-medium text-destructive'>{errors.name.message}</p>}
            </div>

            <div className='items-center gap-2 md:ml-auto flex'>
              <Button variant='outline' size='sm' type='reset'>
                Hủy
              </Button>
              <Button size='sm' type='submit'>
                Lưu thông tin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
