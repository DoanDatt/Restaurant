'use client'
import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function UpdateProfileForm() {
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: ''
    }
  })

  const name = watch('name')
  const avatar = watch('avatar')

  const previewAvatar = file ? URL.createObjectURL(file) : avatar

  const onSubmit = (data: UpdateMeBodyType) => {
    console.log(data, file)
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
              render={({ field }) => (
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
              )}
            />
            {errors.avatar && <p className='text-sm font-medium text-destructive'>{errors.avatar.message}</p>}

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
