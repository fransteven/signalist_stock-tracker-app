"use client"
import FooterLink from '@/components/forms/FooterLink'
import InputField from '@/components/forms/InputField'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useForm } from 'react-hook-form'

function SignIn() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur'
  })
  const onSubmit = async (data: SignInFormData) => {
    try {
      console.log(data)

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <h1 className="form-title">LogIn Your Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

        <InputField
          name='email'
          label='Email'
          placeholder='Enter your email'
          register={register}
          error={errors.email}
          validation={{ required: "Email is required", minLength: 3 }}
        />
        <InputField
          name='password'
          label='Password'
          placeholder='Enter your password'
          register={register}
          error={errors.password}
          validation={{ required: "Password is required", minLength: 3 }}
          type='password'
        />
        <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
          {isSubmitting ? "Entering your account" : "Log In"}
        </Button>

        <FooterLink
          text="Don't have an account?"
          linkText='Create an account'
          href='/sign-up'
        />
      </form>
    </>
  )
}

export default SignIn
