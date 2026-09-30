import ChangePasswordForm from '@/app/manage/setting/change-password-form'
import UpdateProfileForm from '@/app/manage/setting/update-profile-form'
import { Separator } from '@/components/ui/separator'
import { ShieldCheck, UserRound } from 'lucide-react'

export default function Setting() {
  return (
    <main className='flex-1 p-4 sm:px-6 sm:py-0'>
      <div className='mx-auto w-full max-w-5xl'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold tracking-tight'>Cài đặt</h1>
          <p className='text-sm text-muted-foreground'>Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.</p>
        </div>

        <Separator className='my-6' />

        <div className='space-y-10'>
          <section className='grid gap-4 lg:grid-cols-[240px_1fr] lg:gap-10'>
            <div className='flex gap-3 lg:flex-col'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <UserRound className='size-5' />
              </div>
              <div className='space-y-1'>
                <h2 className='font-medium'>Hồ sơ</h2>
                <p className='text-sm text-muted-foreground'>Ảnh đại diện và tên hiển thị với mọi người.</p>
              </div>
            </div>
            <UpdateProfileForm />
          </section>

          <section className='grid gap-4 lg:grid-cols-[240px_1fr] lg:gap-10'>
            <div className='flex gap-3 lg:flex-col'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                <ShieldCheck className='size-5' />
              </div>
              <div className='space-y-1'>
                <h2 className='font-medium'>Bảo mật</h2>
                <p className='text-sm text-muted-foreground'>
                  Nên dùng mật khẩu dài, khó đoán và không dùng lại ở nơi khác.
                </p>
              </div>
            </div>
            <ChangePasswordForm />
          </section>
        </div>
      </div>
    </main>
  )
}
