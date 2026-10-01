import accountApiRequest from '@/apiRequest/account'
import { UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAccountMe = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequest.me
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe
  })
}
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword
  })
}
export const useGetAccountList = () => {
  return useQuery({
    queryKey: ['account'],
    queryFn: accountApiRequest.list
  })
}
export const useGetAccount = (id: number) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => accountApiRequest.getEmployee(id)
  })
}
export const useAddEmployeeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] })
      // nếu mà thành công thì sẽ gọi lại query list account để cập nhật lại danh sách
    }
  })
}
export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] })
      // nếu mà thành công thì sẽ gọi lại query list account để cập nhật lại danh sách
    }
  })
}
export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] })
    }
  })
}
