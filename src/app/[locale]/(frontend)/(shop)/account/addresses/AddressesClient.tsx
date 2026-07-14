'use client'

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { COUNTRIES } from '@/lib/countries'

export interface AddressItem {
  id: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}


export interface AccountAddressesProps {
  addresses: AddressItem[];
}

export function AddressesClient({ addresses }: AccountAddressesProps) {
  const t = useTranslations('account.addresses')
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  
  const editingAddress = editingId ? addresses.find(a => a.id === editingId) : null

  async function handleAddSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (editingId) {
          const { updateAddress } = await import('./actions')
          const result = await updateAddress(editingId, formData)
          if (!result?.success) {
            toast.error(result?.error || t('toastUpdateFailed'))
            return
          }
          toast.success(t('toastUpdateSuccess'))
        } else {
          const { addAddress } = await import('./actions')
          const result = await addAddress(formData)
          if (!result?.success) {
            toast.error(result?.error || t('toastSaveFailed'))
            return
          }
          toast.success(t('toastSaveSuccess'))
        }
        setOpen(false)
        setEditingId(null)
      } catch (error: any) {
        toast.error(error.message || t('toastUnexpectedError'))
      }
    })
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      const { deleteAddress } = await import('./actions')
      await deleteAddress(id)
      toast.success(t('toastDeleteSuccess'))
    })
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setOpen(true)
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      setTimeout(() => {
        setEditingId(null)
      }, 300) // Clear after closing animation
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col w-full"
    >
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10 border-b border-gray-200 pb-6">
        <h1 className="text-4xl text-black font-bold tracking-tighter font-heading">
          {t('title')}
        </h1>
        <p className="text-sm text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Add New Address Card / Trigger */}
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <button 
              onClick={() => setEditingId(null)}
              className="h-full min-h-[300px] bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-6 text-gray-400 hover:text-black hover:border-gray-400 hover:bg-gray-50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500 relative z-10">
                <Plus size={24} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] relative z-10 font-heading">{t('addNewAddress')}</span>
            </button>
          </DialogTrigger>

          {/* Address Modal */}
          <DialogContent className="sm:max-w-[600px] bg-white border border-gray-100 p-0 overflow-hidden rounded-2xl shadow-2xl">
            <form action={handleAddSubmit} key={editingId || 'new'}>
              <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold tracking-tight text-black font-heading">
                    {editingId ? t('editAddressTitle') : t('addAddressTitle')}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 mt-2">
                    {editingId ? t('editAddressDescription') : t('addAddressDescription')}
                  </DialogDescription>
                </DialogHeader>
              </div>
              
              <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar" data-lenis-prevent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('firstName')}</Label>
                    <Input name="firstName" id="firstName" defaultValue={editingAddress?.firstName || ''} required placeholder={t('firstName')} className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('lastName')}</Label>
                    <Input name="lastName" id="lastName" defaultValue={editingAddress?.lastName || ''} required placeholder={t('lastName')} className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="line1" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('streetAddress')}</Label>
                    <Input name="line1" id="line1" defaultValue={editingAddress?.line1 || ''} required placeholder={t('streetAddress')} className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="line2" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('apartmentOptional')}</Label>
                    <Input name="line2" id="line2" defaultValue={editingAddress?.line2 || ''} placeholder={t('apartmentPlaceholder')} className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="city" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('city')}</Label>
                    <Input name="city" id="city" defaultValue={editingAddress?.city || ''} required placeholder={t('city')} className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="state" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('state')}</Label>
                    <Input name="state" id="state" defaultValue={editingAddress?.state || ''} required placeholder={t('state')} className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="zip" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('zipCode')}</Label>
                    <Input name="zip" id="zip" defaultValue={editingAddress?.postalCode || ''} required placeholder={t('zipCode')} className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('phone')}</Label>
                    <Input name="phone" id="phone" defaultValue={editingAddress?.phone || ''} required type="tel" placeholder="(555) 555-5555" className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <Label htmlFor="country" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('country')}</Label>
                    <Select name="country" defaultValue={editingAddress?.country || 'US'} required>
                      <SelectTrigger id="country" className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading w-full data-[state=open]:ring-1 data-[state=open]:ring-black/10 transition-shadow">
                        <SelectValue placeholder={t('country')} />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        sideOffset={8}
                        className="max-h-72 rounded-2xl border-gray-100 bg-white p-2 shadow-xl shadow-black/[0.06]"
                      >
                        {COUNTRIES.map((c) => (
                          <SelectItem
                            key={c.code}
                            value={c.code}
                            className="rounded-xl py-3 px-3 text-sm cursor-pointer font-heading data-[highlighted]:bg-black/5 data-[state=checked]:bg-black/5 data-[state=checked]:font-semibold"
                          >
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 flex items-center space-x-3 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Checkbox name="isDefault" id="default" defaultChecked={editingAddress?.isDefault || false} className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black" />
                    <label
                      htmlFor="default"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                    >
                      {t('setAsDefault')}
                    </label>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-8 border-t border-gray-100 bg-white flex sm:justify-end gap-3 rounded-b-2xl">
                <DialogClose asChild>
                  <button type="button" className="px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 hover:text-black hover:bg-gray-50 transition-colors font-heading">
                    {t('cancel')}
                  </button>
                </DialogClose>
                <button disabled={isPending} type="submit" className="px-8 py-3 rounded-full bg-black text-white text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-gray-800 transition-all shadow-lg shadow-black/10 disabled:opacity-50 font-heading">
                  {isPending ? t('saving') : t('saveAddress')}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Existing Addresses */}
        {addresses.map((address, i) => (
          <motion.div 
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.1 }}
            className="relative p-8 border border-gray-100 rounded-2xl flex flex-col justify-between bg-white shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 overflow-hidden group"
          >
            {address.isDefault && (
              <div className="absolute top-6 right-6 bg-green-50 text-green-600 border border-green-200 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 font-heading">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {t('default')}
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-500 leading-relaxed">
                <span className="text-xl text-black font-bold tracking-tight mb-2 font-heading">{address.firstName} {address.lastName}</span>
                <span className="font-heading">{address.line1}</span>
                {address.line2 && <span className="font-heading">{address.line2}</span>}
                <span className="font-heading">{address.city}, {address.state} {address.postalCode}</span>
                <span className="font-heading">{address.country}</span>
                <span className="mt-4 inline-flex px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-600 text-xs self-start font-medium font-heading">{address.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-8 mt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button disabled={isPending} onClick={() => handleEdit(address.id)} className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-black hover:text-white text-black py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] transition-all disabled:opacity-50 font-heading">
                <Edit2 size={14} />
                {t('edit')}
              </button>
              <button disabled={isPending} onClick={() => handleDelete(address.id)} className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] transition-all disabled:opacity-50 font-heading">
                <Trash2 size={14} />
                {t('delete')}
              </button>
            </div>
          </motion.div>
        ))}
        
      </div>
    </motion.div>
  )
}
