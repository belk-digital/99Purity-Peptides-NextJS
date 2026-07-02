import type { CollectionConfig } from 'payload'
import { beforeChangeEmailLowercase, afterCreateUserTodo } from '@/hooks/users'
import { accessUsers } from '@/access/users'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 7200,
    forgotPassword: {
      generateEmailHTML: ({ token, user } = {}) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
        const locale = (user as any)?.preferredLocale === 'es' ? '/es' : ''
        const url = `${base}${locale}/reset-password/${token}`
        return `<p>Click the link below to reset your password:</p><p><a href="${url}">${url}</a></p><p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`
      },
    },
  },
  access: accessUsers,
  fields: [
    // default fields added by Payload: email, password
    {
      name: 'firstName',
      type: 'text',
      required: false,
    },
    {
      name: 'lastName',
      type: 'text',
      required: false,
    },
    {
      name: 'googleId',
      type: 'text',
      unique: true,
      index: true,
      access: {
        read: () => false,
        update: () => false, // Prevent manual editing in admin UI
      },
    },
    {
      name: 'authProvider',
      type: 'select',
      defaultValue: 'credentials',
      options: [
        { label: 'Email/Password', value: 'credentials' },
        { label: 'Google', value: 'google' },
      ],
      access: {
        update: () => false,
      },
    },
    {
      name: 'pendingEmail',
      type: 'text',
      access: { read: () => false },
    },
    {
      name: 'pendingEmailCodeHash',
      type: 'text',
      access: { read: () => false },
    },
    {
      name: 'pendingEmailCodeExpiresAt',
      type: 'date',
      access: { read: () => false },
    },
    {
      name: 'phone',
      type: 'text',
      validate: (val: string | null | undefined) => {
        if (!val) return true
        const regex = /^\+?[1-9]\d{1,14}$/
        return regex.test(val) || 'Phone must be in E.164 format'
      },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
      ],
    },

    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'acceptsMarketing',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'preferredLocale',
      type: 'select',
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' },
      ],
    },
    {
      name: 'dateOfBirth',
      type: 'date',
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        readOnly: true,
        condition: ({ user }) => !!user?.role && ['admin', 'staff'].includes(user.role),
      },
    },
    {
      name: 'defaultShippingAddress',
      type: 'relationship',
      relationTo: 'addresses',
      hasMany: false,
      // TODO: implement lazy loading / null handling once Addresses collection is ready
    },
    {
      name: 'defaultBillingAddress',
      type: 'relationship',
      relationTo: 'addresses',
      hasMany: false,
      // TODO: implement lazy loading / null handling once Addresses collection is ready
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
        condition: ({ user }) => !!user?.role && ['admin', 'staff'].includes(user.role),
      },
    },
    {
      name: 'metadata',
      type: 'json',
    },
    {
      name: 'maxxPoints',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Maxx Points ($1 per point). Can be used by users at checkout.',
      },
    },
  ],
  hooks: {
    beforeChange: [beforeChangeEmailLowercase],
    afterChange: [afterCreateUserTodo],
  },
}
