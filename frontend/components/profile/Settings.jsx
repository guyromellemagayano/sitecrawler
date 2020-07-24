import styled from 'styled-components'
import Layout from '../Layout'
import ProfileSettingsPersonal from './Personal'

const ProfileSettingsDiv = styled.div``

const ProfileSettings = () => {
  return (
    <Layout>
      <ProfileSettingsDiv>
        <ProfileSettingsPersonal />
      </ProfileSettingsDiv>
    </Layout>
  )
}

export default ProfileSettings