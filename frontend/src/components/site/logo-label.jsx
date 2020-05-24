import styled from 'styled-components'

const LogoLabelDiv = styled.div``

const LogoLabel = ({ isLogin, isSignUp, isResetPassword }) => {
  return (
    <LogoLabelDiv className={`sm:mx-auto sm:w-full sm:max-w-md`}>
      <img
        className={`mx-auto h-12 w-auto`}
        src='/img/logos/workflow-mark-on-dark.svg'
        alt='Workflow'
      />
      <h2 className={`mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900`}>
        {isLogin ? 'Sign in to your account' : isSignUp ? 'Sign up for a new account' : 'Reset Password'}
      </h2>
    </LogoLabelDiv>
  )
}

export default LogoLabel