import Link from 'next/link'
import styled from 'styled-components'
import AppLogo from 'components/logo/AppLogo'

const LogoLabelDiv = styled.div``

const LogoLabel = ({ isLogin, isSignUp, isResetPassword }) => {
  return (
    <LogoLabelDiv className={`sm:mx-auto sm:w-full sm:max-w-md`}>
      {!isLogin ? (
        <Link href="/">
          <a>
            <AppLogo
              className={`h-10 w-auto mx-auto`}
              src={`/img/logos/site-logo-dark.svg`}
              alt={`app-logo`}
            />
          </a>
        </Link>
      ) : null}
      <h2 className={`mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900`}>
        {isLogin ? 'Log In' : isSignUp ? 'Sign up' : isResetPassword ? 'Reset Password' : 'Reset Password Form'}
      </h2>
    </LogoLabelDiv>
  )
}

export default LogoLabel