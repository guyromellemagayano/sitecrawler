import Link from 'next/link'
import styled from 'styled-components'
import AppLogo from 'components/logo/AppLogo'

const LogoLabelDiv = styled.div``

const LogoLabel = ({ isLogin, isSignUp, isResetPassword }) => {
  return (
    <LogoLabelDiv className={`sm:mx-auto sm:w-full sm:max-w-md`}>
      <Link href="/">
        <a>
          <AppLogo
            className={`h-10 w-auto mx-auto`}
            src={`/img/logos/site-logo.svg`}
            alt={`app-logo`}
          />
        </a>
      </Link>
      <h2 className={`mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900`}>
        {isLogin ? 'Sign in to your account' : isSignUp ? 'Sign up for a new account' : isResetPassword ? 'Reset Password' : 'Reset Password Form'}
      </h2>
    </LogoLabelDiv>
  )
}

export default LogoLabel