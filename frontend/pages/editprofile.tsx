import Layout from '../components/Layout';
import EditProfileForm from '../components/form/EditProfileForm';
import classes from '../utils/classes';
import { Container } from '@mui/material';

const EditProfile = () => {
  return (
    <Layout>
      <Container maxWidth='xl' sx={classes.main}>
        <h1>Edit Your Profile</h1>
        <EditProfileForm />
      </Container>
    </Layout>
  );
};

export default EditProfile;
