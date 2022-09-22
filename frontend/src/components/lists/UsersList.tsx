import React from "react";
import Image from 'next/image'
import { styled } from '@mui/system';
// Types/Interfaces
import { User } from '../../schemas/users';
// Components
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';
// --------------------------------------------------------------
// --------------------------------------------------------------

/**
 * ! !!!!!!! ATTENTION !!!!!!!!
 * The below list is in a base state.
 * Your task is to improve the UX/UI to the best of your ability.
 *
 * TODO: Style/rearrange the list to maximize UI/UX
 *
 * ! !!!!!!!!!!!!!!!!!!!!!!!!!!
 */

// ***** Define styles ***** //
const ListItemRootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  borderRadius: 0,
  borderColor: theme.palette.common.black,
}));

const emailSX = {
  cursor: "pointer",
  color: "black",
  textDecoration: "none",
  "&:hover": {
    color: "blue",
  }
}

// ----------------------------------------------------------------

// ***** Define List Item ***** //
interface UsersListItemProps {
  user: User;
}
function UsersListItem({ user }: UsersListItemProps) {
  return (
    <ListItemRootStyle>
      <CardContent>
        <Grid
          container
          key={user._id}
          spacing={2}
          justifyContent='center'
          alignItems='center'
        >
          {/* Image */}
          <Grid item lg={3} sx={{ width: 128, height: 128 }}>
            <Image alt="avatar" src="/avatar.jpg" width='96' height='96'/>
          </Grid>

          {/* Text */}
          <Grid item lg={9} container>
            <Grid item lg container direction="column" spacing={1}>
              {/* Name & Role */}
              <Grid item lg>
                <Typography variant="h5">
                  {user.name.title && user.name.title} {user.name.givenName} {user.name.middleName} {user.name.familyName} {user.name.suffix}
                </Typography>
                <Typography variant="subtitle1">{user.role}</Typography>
              </Grid>
              {/* End name */}

              {/* Contact Info */}
              <Grid item lg>
                <Typography
                    variant="body1"
                    component="a"
                    href={`mailto:${user.email}`}
                    sx={emailSX}
                >
                  {user.email}
                </Typography>
                <Typography variant="body1">{user.phone}</Typography>
              </Grid>
              {/* End info */}
            </Grid>
          {/* End text */}
          </Grid>
        </Grid>
      </CardContent>
    </ListItemRootStyle>
  );
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------

// ***** Define styles ***** //
const ListRootStyle = styled(List)(({ theme }) => ({
  width: '100%',
  bgcolor: 'background.paper',
  position: 'relative',
  '& ul': { padding: 0 },
}));

// ----------------------------------------------------------------

interface UsersListProps {
  users: User[];
}

export default function UsersList({ users }: UsersListProps) {
  return (
    <Box>
      <Container sx={{ p: 1 }}>
        <Typography variant='h4'>Users</Typography>
      </Container>

      {users.length ? (
        <ListRootStyle>
          {users.map((user) => (
            <ListItem key={user._id} children={<UsersListItem user={user} />} />
          ))}
        </ListRootStyle>
      ) : (
        <Typography>{'No users'}</Typography>
      )}
    </Box>
  );
}
