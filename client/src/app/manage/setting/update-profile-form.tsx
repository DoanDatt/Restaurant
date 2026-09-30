'use client'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Camera, Loader2, Upload } from 'lucide-react'
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

  const account = data?.payload.data
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0].toUpperCase())
    .join('')
  const isSubmitting = updateMeMutation.isPending || uploadMediaMutation.isPending

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
      onReset={reset}
      onSubmit={form.handleSubmit(onSubmit, (e) => {
        console.log(e)
      })}
    >
      <Card>
        <CardHeader className='-mt-4 border-b bg-linear-to-r from-primary/15 via-primary/5 to-transparent pt-4'>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>{account?.email}</CardDescription>
          {account?.role && (
            <CardAction>
              <Badge variant='outline' className='border-primary/30 bg-primary/10 text-primary'>
                {account.role}
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <FieldGroup className='gap-6'>
            <Controller
              control={form.control}
              name='avatar'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className='flex items-center gap-5'>
                    <button
                      type='button'
                      onClick={() => avatarInputRef.current?.click()}
                      className='group relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
                    >
                      <Avatar className='size-20 ring-2 ring-primary/40 ring-offset-2 ring-offset-card'>
                        <AvatarImage src={previewAvatar} alt={name} />
                        <AvatarFallback className='bg-primary/15 text-xl font-medium text-primary'>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100'>
                        <Camera className='size-5' />
                      </span>
                      <span className='sr-only'>Đổi ảnh đại diện</span>
                    </button>
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
                    <div className='space-y-2'>
                      <Button type='button' variant='outline' size='sm' onClick={() => avatarInputRef.current?.click()}>
                        <Upload />
                        Tải ảnh lên
                      </Button>
                      <FieldDescription>
                        {file ? file.name : 'Nên dùng ảnh vuông, định dạng JPG hoặc PNG.'}
                      </FieldDescription>
                    </div>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name='name'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='name'>Tên hiển thị</FieldLabel>
                  <Input id='name' type='text' aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className='justify-end gap-2'>
          <Button variant='ghost' type='reset'>
            Hủy
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='animate-spin' />}
            Lưu thay đổi
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
