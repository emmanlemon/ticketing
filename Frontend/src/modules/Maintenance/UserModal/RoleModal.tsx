import { useEffect, useState } from 'react'
import { User } from '../../../api/services/user';
import { useForm } from 'react-hook-form';
import { roleUser, roleUserFormType } from '../../../schema/User/UpdateUserRole';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import SelectItem from '../../../components/common/SelectItem';
import { Role } from '../../../api/services/role';

export default function RoleModal({data, setOpen, refetch}:any) {
    const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm<roleUserFormType>({
        resolver: yupResolver(roleUser),
      });
    
      const [dataValue, setDataValue] = useState([]);
      const getDataList = async () => {
        try {
          const response = await Role.getRole();
          const data = response.map((row: any) => ({
            value: row.id,
            label: row.name,
          }));
          setDataValue(data);
        } catch (error) {
          console.error("Error fetching category list:", error);
          throw error;
        }
      };
      useEffect(() => {
        getDataList();
      }, []);
    
      const onSubmit = async (formData: any) => {
        try {
          await User.updateUserRole(data.id, formData);
          refetch();
        } catch (error) {}
        setOpen(false);
      };
    return (
  <>
   <DialogTitle>Select User Role</DialogTitle>
      <DialogContent>
        <form style={{ marginTop: 10 }} onSubmit={handleSubmit(onSubmit)}>
          <SelectItem
            label="Role Name"
            control={control}
            options={dataValue}
            errors={errors}
            name="role_id"
            fullWidth
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </DialogActions></>
  )
}
