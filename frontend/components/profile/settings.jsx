import styled from 'styled-components'
import Layout from '../../components/layout'
import ProfileSettingsPersonal from './personal'

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