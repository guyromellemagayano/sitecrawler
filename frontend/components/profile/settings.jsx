import styled from 'styled-components'
import Layout from '../../components/layout'
import ProfileSettingsPersonal from './personal'
import ProfileSettingsPassword from './password'

const ProfileSettingsDiv = styled.div``

const ProfileSettings = () => {
  return (
    <Layout>
      <ProfileSettingsDiv>
        <ProfileSettingsPersonal />
        {/* <ProfileSettingsPassword /> */}
      </ProfileSettingsDiv>
    </Layout>
  )
}

export default ProfileSettings