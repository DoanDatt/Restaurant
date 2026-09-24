'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useUploadMediaMutation } from '@/queries/useMedia'
import { handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import { useAccountMe, useUpdateMeMutation } from '@/queries/useAccount'

export default function UpdateProfileForm() {
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const { data, refetch } = useAccountMe()
  const updateMeMutation = useUpdateMeMutation()
  const uploadMediaMutation = useUploadMediaMutation()
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: ''
    }
  })

  const avatar = form.watch('avatar')
  const name = form.watch('name')
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

  const reset = () => {
    form.reset()
    setFile(null)
  }
  const onSubmit = async (values: UpdateMeBodyType) => {
    if (updateMeMutation.isPending) return
    try {
      let body = values
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageResult = await uploadMediaMutation.mutateAsync(formData)
        const imageUrl = uploadImageResult.payload.data
        body = {
          ...values,
          avatar: imageUrl
        }
      }
      const result = await updateMeMutation.mutateAsync(body)
      toast('Success', {
        description: result.payload.message
      })
      refetch()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }
  return (
    <form
      noValidate
      className='grid auto-rows-max items-start gap-4 md:gap-8'
      onReset={reset}
      onSubmit={form.handleSubmit(onSubmit, (e) => {
        console.log(e)
      })}
    >
      <Card x-chunk='dashboard-07-chunk-0'>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <Controller
              control={form.control}
              name='avatar'
              render={({ field, fieldState }) => (
                <div className='flex flex-col gap-2 items-start justify-start'>
                  <div className='flex gap-2 items-start justify-start'>
                    <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                      <AvatarImage src={previewAvatar} />
                      <AvatarFallback className='rounded-none'>{name}</AvatarFallback>
                    </Avatar>
                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      ref={avatarInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setFile(file)
                          field.onChange('http://localhost:3000/' + field.name)
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
                control={form.control}
                name='name'
                render={({ field, fieldState }) => (
                  <>
                    <Input id='name' type='text' className='w-full' {...field} />
                    {fieldState.invalid && (
                      <p className='text-sm font-medium text-destructive'>{fieldState.error?.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div className=' items-center gap-2 md:ml-auto flex'>
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
