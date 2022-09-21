import {Controller, FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
// Schemas
import {
  createUserSchema,
  defaultValuesUser,
  updateUserSchema,
  User, userRoles, userSuffixes
} from '../../schemas/users';
// Hooks
import useCreateUser from '../../hooks/users/useCreateUser';
import useUpdateUser from '../../hooks/users/useUpdateUser';
// Components
import { LoadingButton } from '@mui/lab';
import {Stack, Button, Box, Container, Typography, MenuItem, Select} from '@mui/material';
import StringInput from '../input/StringInput';
// ----------------------------------------------------------------
// ----------------------------------------------------------------

/**
 * ! !!!!!!! ATTENTION !!!!!!!!
 * The below form has been started to help demonstrate how to work with these packages.
 *
 * TODO: Add missing fields/inputs to the form
 * TODO: Ensure all input fields are being validated correctly per the "zod" schema
 * TODO: Submit valid data to the API
 * TODO: Style/rearrange the form to maximize UI/UX
 *
 * ! !!!!!!!!!!!!!!!!!!!!!!!!!!
 */

// ***** Define Component ***** //
interface Props {
  user?: User;
  onClose?: VoidFunction;
}
export default function UserCreateUpdateForm({ user, onClose }: Props) {
  // HOOKS
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser(String(user?._id));

  // CONFIG
  const defaultValues = user ? user : defaultValuesUser();

  // FORM
  /**
   * @docs  https://react-hook-form.com/api/useform/
   */
  const formMethods = useForm<User>({
    mode: 'onTouched',
    resolver: zodResolver(user ? updateUserSchema : createUserSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isSubmitting, isValid },
  } = formMethods;

  // HANDLERS
  const handleSave: SubmitHandler<User> = (data) => {
    console.log(data)
    try {
      if (user) {
        console.info('updating user...');
        updateUserMutation.mutate(data, {
          onSuccess: () => {
            reset({ ...data });
          },
          onError: (error: any) => {
            window.alert(JSON.stringify(error));
          },
        });
      } else {
        console.info('creating new user...');
        createUserMutation.mutate(data, {
          onSuccess: () => {
            reset();
          },
          onError: (error: any) => {
            window.alert(JSON.stringify(error));
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container sx={{ p: 1 }}>
        <Typography variant='h4'>
          {user ? `${user.name.givenName}` : 'Create User'}
        </Typography>
      </Container>
      <Box>
        <Stack spacing={3} sx={{ p: 3, pb: 0 }}>
          <FormProvider {...formMethods}>
            <form
              onSubmit={handleSubmit((data) => handleSave(data))}
              className='form'
            >
              <Stack spacing={2}>
                {/* this linting error appears to be a regression bug introduced in 6.13.0 */}
                <Controller
                    render={({ field }) => (
                        <Select {...field}>
                          {userRoles.map(role => (
                              <MenuItem value={role}>{role}</MenuItem>
                          ))}
                        </Select>
                    )}
                    labelId='select-role-label'
                    id='select-role'
                    control={control}
                    label='Role'
                    name='role'>
                </Controller>
                <Controller
                    render={({ field }) => (
                        <Select {...field}>
                          <MenuItem value='Mr.'>Mr.</MenuItem>
                          <MenuItem value='Mrs.'>Mrs.</MenuItem>
                          <MenuItem value='Dr.'>Dr.</MenuItem>
                        </Select>
                    )}
                    labelId='select-title-label'
                    id='select-title'
                    control={control}
                    label='Title'
                    name='name.title'>
                </Controller>
                <StringInput
                    fieldName='name.givenName'
                    label='First Name'
                    control={control}
                />
                <StringInput
                    fieldName='name.middleName'
                    label='Middle Name'
                    control={control}
                />
                <StringInput
                    fieldName='name.familyName'
                    label='Last Name'
                    control={control}
                />
                <Controller
                    render={({ field }) => (
                        <Select {...field}>
                          {userSuffixes.map(suffix => (
                              <MenuItem value={suffix}>{suffix}</MenuItem>
                          ))}
                        </Select>
                    )}
                    labelId='select-suffix-label'
                    id='select-suffix'
                    control={control}
                    label='Suffix'
                    name='name.suffix'>
                </Controller>
                <StringInput
                    fieldName='email'
                    label='Email'
                    control={control}
                />
                <StringInput
                    fieldName='phone'
                    label='Phone'
                    control={control}
                />

              </Stack>

              {/* Submit Buttons */}
              <Stack direction='row' sx={{ justifyContent: 'flex-end', mt: 2 }}>
                <LoadingButton
                  color='primary'
                  size='large'
                  type='submit'
                  variant='contained'
                  loading={
                    isSubmitting ||
                    createUserMutation.isLoading ||
                    updateUserMutation.isLoading
                  }
                  disabled={!isDirty || !isValid}
                >
                  Save
                </LoadingButton>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  onClick={() => {
                    reset();
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </form>
            <DevTool control={control} />
          </FormProvider>
        </Stack>
      </Box>
    </>
  );
}
