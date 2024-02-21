import { FileDown, MoreHorizontal, Plus, Search} from 'lucide-react'
import { Header } from "./components/header"
import { Button } from "./components/ui/button"
import { Control, Input } from "./components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Pagination } from "./components/pagination"
import { Tabs } from "./components/tabs"

export function App() {
  return (
    <div className="py-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <Button type="button" variant="primary" className="inline-flex items-center gap-1.5 text-xs bg-teal-300 text-teal-950 font-medium rounded-full px-1.5 py-1">
            <Plus className="size-3" />
            Create new
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Input variant="filter">
            <Search className="size-3" />
            <Control placeholder="Search tags..." />
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
            {Array.from({ length: 10}).map((_, i) => {
              return (
                <TableRow key={i}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">React</span>
                      <span className="text-xs text-zinc-500">e0892804-39ae-4009-9bea-149aea371290</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    13 video(S)
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
        <Pagination  />
      </main>
    </div>
  )
}
