import { Check, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from '@radix-ui/react-dialog'
import { getSlugFromString } from "../utils/get-slug-from-string";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createTagSchema = z.object({
  title: z.string().min(3, { message: 'Minimum 3 characters.'}),
})

type CreateTagSchema = z.infer<typeof createTagSchema>

export function CreateTagForm() {
  const queryClient = useQueryClient()

  const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<CreateTagSchema>({
    resolver: zodResolver(createTagSchema),

  })

  const slug = watch('title') 
  ? getSlugFromString(watch('title')) 
  : ''

  const { mutateAsync } = useMutation({
    mutationFn: async ({ title }: CreateTagSchema) => {
      await new Promise(resolve => setTimeout(resolve, 2000))

      await fetch('http://localhost:3333/tags', {
        method: 'POST',
        body: JSON.stringify({
          title,
          slug,
          amountOfVideos: 0,
        })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-tags']
      })
    }
  })

  async function createTag({ title }: CreateTagSchema) {
    await mutateAsync({ title })
  }

 
  return (
    <form onSubmit={handleSubmit(createTag)} className="w-full space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium block">Tag name</label>
        <input 
          id="name" 
          type="text"
          className="w-full border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-800/50 text-sm outline-none" 
          {...register('title')}
        />
        {errors.title && (
          <p className="px-1 text-xs text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium block">Slug</label>
        <input 
          id="slug" 
          type="text" 
          value={slug}
          readOnly 
          className="w-full border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-800/50 text-sm outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button>
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>
        <Button type="submit" className="bg-teal-400 text-teal-950">
          {isSubmitting 
            ? <Loader2 className="size-3 animate-spin" /> 
            : <Check className="size-3" />}
          Save
        </Button>
      </div>
    </form>
  )
}