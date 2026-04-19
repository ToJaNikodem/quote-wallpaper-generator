import { Plus, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from './components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from './components/ui/field'
import { Input } from './components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'
import { Separator } from './components/ui/separator'
import { Textarea } from './components/ui/textarea'

type QuoteInput = {
  id: string
  value: string
}

function createQuoteInput(): QuoteInput {
  return {
    id: crypto.randomUUID(),
    value: '',
  }
}

function App() {
  const [quotes, setQuotes] = useState<QuoteInput[]>([createQuoteInput()])

  function addQuote() {
    setQuotes((currentQuotes) => [...currentQuotes, createQuoteInput()])
  }

  function updateQuote(id: string, quote: string) {
    setQuotes((currentQuotes) =>
      currentQuotes.map((currentQuote) =>
        currentQuote.id === id ? { ...currentQuote, value: quote } : currentQuote
      )
    )
  }

  function deleteQuote(id: string) {
    setQuotes((currentQuotes) => currentQuotes.filter((currentQuote) => currentQuote.id !== id))
  }

  return (
    <main className="flex flex-col items-center h-screen py-16 gap-8">
      <h1 className="text-4xl font-bold">Quote Wallpaper Generator</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create quotes</CardTitle>
          <CardDescription>One quote per input</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldSet className="flex flex-col gap-3">
              {quotes.map((quote) => (
                <Field key={quote.id}>
                  <div className="relative">
                    <Textarea
                      value={quote.value}
                      onChange={(event) => updateQuote(quote.id, event.target.value)}
                      placeholder="Enter your quote here"
                      className="pr-10"
                    />
                    {quotes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="absolute top-2 right-2"
                        aria-label="Delete quote"
                        onClick={() => deleteQuote(quote.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                </Field>
              ))}
              <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={addQuote}>
                  <Plus />
                  Add quote
                </Button>
              </div>
            </FieldSet>
            <Separator />
            <FieldSet className="flex flex-row gap-8">
              <Field>
                <FieldLabel>Background Color</FieldLabel>
                <Input type="color" value="#121212" />
                <FieldDescription className="uppercase">#121212</FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Text Color</FieldLabel>
                <Input type="color" value="#ffffff" />
                <FieldDescription className="uppercase">#ffffff</FieldDescription>
              </Field>
            </FieldSet>
            <Separator />
            <FieldSet>
              <Field>
                <FieldLabel>Resolution</FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1920x1080">1920×1080</SelectItem>
                      <SelectItem value="3840x2160">3840×2160</SelectItem>
                      <SelectItem value="2622x1206">2622×1206 (iPhone 16-17 Pro)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldSet>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create Wallpapers</Button>
        </CardFooter>
      </Card>
    </main>
  )
}

export default App
