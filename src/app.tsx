import { FileDown, MoreHorizontal, Plus, Search} from 'lucide-react'
import { Header } from "./components/header"
import { Button } from "./components/ui/button"
import { Control, Input } from "./components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Pagination } from "./components/pagination"
import { Tabs } from "./components/tabs"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDebounceValue } from "./hooks/use-debounce-value"
import * as Dialog from '@radix-ui/react-dialog'
import { CreateTagForm } from "./components/create-tag-form"

export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Tag[]
}

export interface Tag {
  title: string
  slug: string
  amountOfVideos: number
  id: string
}


export function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState(searchParams.get('filter') ?? '')

  const debouncedFilter = useDebounceValue(filter, 1000)

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  useEffect(() => {
    setSearchParams(params => {
      params.set('page', '1')
      params.set('filter', debouncedFilter)

      return params
    })
  }, [debouncedFilter])

  const { data: tagsResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ['get-tags', debouncedFilter, page],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/tags?_page=${page}&_per_page=10&title=${debouncedFilter}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
  })

  if (isLoading) {
    return null
  }

  return (
    <div className="py-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button type="button" variant="primary" className="inline-flex items-center gap-1.5 text-xs bg-teal-300 text-teal-950 font-medium rounded-full px-1.5 py-1">
                <Plus className="size-3" />
                Create new
              </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/70" />
              <Dialog.Content className="fixed space-y-10 p-10 right-0 bottom-0 h-screen min-w-[320px] border-l border-zinc-900 bg-zinc-950">
                <div className="space-y-3">
                  <Dialog.Title className="text-xl font-bold">
                    Create tag
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-zinc-500">
                    Tags can be used to group similar concepts.
                  </Dialog.Description>
                </div>

                <CreateTagForm />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div className="flex items-center justify-between">
          <Input variant="filter">
            <Search className="size-3" />
            <Control 
              placeholder="Search tags..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Input>

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableHead></TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Amount of videos</TableHead>
            <TableHead></TableHead>
          </TableHeader>
          <TableBody>
            {tagsResponse?.data.map((tag) => {
              return (
                <TableRow key={tag.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{tag.title}</span>
                      <span className="text-xs text-zinc-500">{tag.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {tag.amountOfVideos} video(s)
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {tagsResponse && (
          <Pagination items={tagsResponse.items} page={page} pages={tagsResponse.pages}  />
        )}
      </main>
    </div>
  )
}
