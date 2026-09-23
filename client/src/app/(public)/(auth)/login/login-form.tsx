/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { Mail, Lock, UtensilsCrossed } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { useLoginMutation } from '@/queries/useAuth'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'

export default function LoginForm() {
  const loginMutation = useLoginMutation()

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (data: LoginBodyType) => {
    if (!loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      toast('Success', {
        description: result.payload.message
      })
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <div className='flex h-screen w-full overflow-hidden bg-[#120F0C] text-[#F5EFE6]'>
      <style jsx global>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-panel-left {
          animation: slide-in-left 5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-panel-right {
          animation: slide-in-right 5s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.12s;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-panel-left,
          .animate-panel-right {
            animation: none;
          }
        }
      `}</style>

      {/* Left — brand panel */}
      <div className='animate-panel-left relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#1C1712] p-10 lg:flex'>
        <div
          className='absolute inset-0 opacity-40'
          style={{
            backgroundImage: 'radial-gradient(rgba(245,239,230,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />
        <div className='absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#E85D28]/25 blur-[100px]' />
        <div className='absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#F4B400]/10 blur-[100px]' />

        <div className='relative flex items-center gap-2'>
          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#E85D28]'>
            <UtensilsCrossed className='h-5 w-5 text-[#120F0C]' />
          </div>
          <span className='text-lg font-semibold'>Big Boy</span>
        </div>

        <div className='relative max-w-md'>
          <p className='font-serif text-3xl leading-tight xl:text-4xl'>
            Món ngon nhà làm, <span className='text-[#E85D28]'>giao tận cửa</span> mỗi ngày.
          </p>
          <p className='mt-3 text-sm text-[#A79C8E]'>
            Quản lý đơn hàng, thực đơn và khách hàng của nhà hàng chỉ trong một nơi.
          </p>
        </div>

        <div className='relative flex gap-8 text-sm text-[#A79C8E]'>
          <div>
            <p className='text-xl font-semibold text-[#F5EFE6]'>500+</p>
            <p>Món ăn</p>
          </div>
          <div>
            <p className='text-xl font-semibold text-[#F5EFE6]'>30 phút</p>
            <p>Giao hàng</p>
          </div>
          <div>
            <p className='text-xl font-semibold text-[#F5EFE6]'>4.8/5</p>
            <p>Đánh giá</p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className='animate-panel-right flex h-full w-full flex-1 items-center justify-center overflow-y-auto px-6 py-6'>
        <div className='w-full max-w-sm'>
          <div className='mb-6 flex items-center gap-2 lg:hidden'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#E85D28]'>
              <UtensilsCrossed className='h-5 w-5 text-[#120F0C]' />
            </div>
            <span className='text-lg font-semibold'>Big Boy</span>
          </div>

          <h1 className='font-serif text-2xl sm:text-3xl'>Đăng nhập</h1>
          <p className='mt-1.5 text-sm text-[#A79C8E]'>Nhập email và mật khẩu để tiếp tục đặt món.</p>

          <form className='mt-6' noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className='gap-4'>
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className='text-[#D9CFC1]'>
                      Email
                    </FieldLabel>
                    <div className='relative'>
                      <Mail className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A6F60]' />
                      <Input
                        {...field}
                        id={field.name}
                        type='email'
                        placeholder='ban@email.com'
                        aria-invalid={fieldState.invalid}
                        className='border-[#332C24] bg-[#1C1712] pl-9 text-[#F5EFE6] placeholder:text-[#7A6F60] focus-visible:ring-[#E85D28]'
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className='flex items-center justify-between'>
                      <FieldLabel htmlFor={field.name} className='text-[#D9CFC1]'>
                        Mật khẩu
                      </FieldLabel>
                      <Link href='/forgot-password' className='text-xs text-[#E85D28] hover:underline'>
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <div className='relative'>
                      <Lock className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A6F60]' />
                      <Input
                        {...field}
                        id={field.name}
                        type='password'
                        aria-invalid={fieldState.invalid}
                        className='border-[#332C24] bg-[#1C1712] pl-9 text-[#F5EFE6] focus-visible:ring-[#E85D28]'
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Field className='mt-1 gap-2.5'>
                <Button type='submit' className='w-full bg-[#E85D28] text-white hover:bg-[#D14E1C]'>
                  Đăng nhập
                </Button>

                <div className='flex items-center gap-3 py-0.5'>
                  <div className='h-px flex-1 bg-[#332C24]' />
                  <span className='text-xs text-[#7A6F60]'>hoặc</span>
                  <div className='h-px flex-1 bg-[#332C24]' />
                </div>

                <Button
                  variant='outline'
                  type='button'
                  className='w-full border-[#332C24] bg-transparent text-[#F5EFE6] hover:bg-[#1C1712]'
                >
                  Đăng nhập bằng Google
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <p className='mt-6 text-center text-sm text-[#A79C8E]'>
            Chưa có tài khoản?{' '}
            <Link href='/register' className='font-medium text-[#E85D28] hover:underline'>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
