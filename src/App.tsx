import { Plus, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

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

type Resolution = {
  label: string
  value: string
  width: number
  height: number
  maxFontSize: number
}

const resolutions: Resolution[] = [
  { label: '1920×1080', value: '1920x1080', width: 1920, height: 1080, maxFontSize: 32 },
  { label: '3840×2160', value: '3840x2160', width: 3840, height: 2160, maxFontSize: 64 },
  {
    label: '1206×2622 (iPhone 16-17 Pro)',
    value: '1206x2622',
    width: 1206,
    height: 2622,
    maxFontSize: 64,
  },
]

function createQuoteInput(): QuoteInput {
  return {
    id: crypto.randomUUID(),
    value: '',
  }
}

function splitLongWord(context: CanvasRenderingContext2D, word: string, maxWidth: number) {
  const parts: string[] = []
  let currentPart = ''

  for (const character of word) {
    const nextPart = `${currentPart}${character}`

    if (currentPart && context.measureText(nextPart).width > maxWidth) {
      parts.push(currentPart)
      currentPart = character
    } else {
      currentPart = nextPart
    }
  }

  if (currentPart) {
    parts.push(currentPart)
  }

  return parts
}

function wrapQuoteLines(context: CanvasRenderingContext2D, quote: string, maxWidth: number) {
  const lines: string[] = []
  const paragraphs = quote.replace(/\r\n/g, '\n').split('\n')

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push('')
      continue
    }

    let currentLine = ''

    for (const word of paragraph.trim().split(/\s+/)) {
      const nextLine = currentLine ? `${currentLine} ${word}` : word

      if (context.measureText(nextLine).width <= maxWidth) {
        currentLine = nextLine
        continue
      }

      if (currentLine) {
        lines.push(currentLine)
      }

      if (context.measureText(word).width > maxWidth) {
        const wordParts = splitLongWord(context, word, maxWidth)
        lines.push(...wordParts.slice(0, -1))
        currentLine = wordParts.at(-1) ?? ''
      } else {
        currentLine = word
      }
    }

    if (currentLine) {
      lines.push(currentLine)
    }
  }

  return lines
}

function getQuoteLayout(
  context: CanvasRenderingContext2D,
  quote: string,
  width: number,
  height: number,
  maxFontSize: number
) {
  const maxTextWidth = width * (width > height ? 0.62 : 0.78)
  const maxTextHeight = height * 0.74
  const minFontSize = 24
  let fontSize = Math.min(maxFontSize, Math.round(width * 0.055))
  context.font = `600 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`
  let lines = wrapQuoteLines(context, quote, maxTextWidth)
  let lineHeight = fontSize * 1.4

  while (fontSize > minFontSize && lines.length * lineHeight > maxTextHeight) {
    fontSize -= 2
    context.font = `600 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`
    lines = wrapQuoteLines(context, quote, maxTextWidth)
    lineHeight = fontSize * 1.4
  }

  return { fontSize, lineHeight, lines }
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function getQuoteFilename(quote: string) {
  const quoteSlug = quote
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `qwp-${quoteSlug || 'quote'}.png`
}

function createWallpaper(
  quote: string,
  resolution: Resolution,
  backgroundColor: string,
  textColor: string,
  filename: string
) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    return
  }

  canvas.width = resolution.width
  canvas.height = resolution.height

  context.fillStyle = backgroundColor
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = textColor

  const { fontSize, lineHeight, lines } = getQuoteLayout(
    context,
    quote,
    canvas.width,
    canvas.height,
    resolution.maxFontSize
  )
  const blockHeight = lines.length * lineHeight
  let textY = (canvas.height - blockHeight) / 2 + lineHeight / 2

  context.font = `600 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`

  for (const line of lines) {
    if (line) {
      context.fillText(line, canvas.width / 2, textY)
    }

    textY += lineHeight
  }

  downloadCanvas(canvas, filename)
}

function App() {
  const [quotes, setQuotes] = useState<QuoteInput[]>([createQuoteInput()])
  const [backgroundColor, setBackgroundColor] = useState('#121212')
  const [textColor, setTextColor] = useState('#ffffff')
  const [selectedResolution, setSelectedResolution] = useState(resolutions[0])
  const [focusedQuoteId, setFocusedQuoteId] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const quoteTextareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({})

  const focusQuote = useCallback((id: string) => {
    window.requestAnimationFrame(() => {
      quoteTextareaRefs.current[id]?.focus()
    })
  }, [])

  const addQuote = useCallback(() => {
    const newQuote = createQuoteInput()

    setQuotes((currentQuotes) => {
      if (currentQuotes.length === 1 && !currentQuotes[0].value.trim()) {
        focusQuote(currentQuotes[0].id)
        return currentQuotes
      }

      focusQuote(newQuote.id)
      return [...currentQuotes, newQuote]
    })
  }, [focusQuote])

  function updateQuote(id: string, quote: string) {
    setQuotes((currentQuotes) =>
      currentQuotes.map((currentQuote) =>
        currentQuote.id === id ? { ...currentQuote, value: quote } : currentQuote
      )
    )
  }

  const deleteQuote = useCallback((id: string) => {
    setQuotes((currentQuotes) => {
      if (currentQuotes.length === 1) {
        const nextQuote = createQuoteInput()

        focusQuote(nextQuote.id)
        return [nextQuote]
      }

      const deletedQuoteIndex = currentQuotes.findIndex((currentQuote) => currentQuote.id === id)
      const nextQuotes = currentQuotes.filter((currentQuote) => currentQuote.id !== id)
      const nextFocusedQuote =
        nextQuotes[Math.min(Math.max(deletedQuoteIndex, 0), nextQuotes.length - 1)]

      if (nextFocusedQuote) {
        focusQuote(nextFocusedQuote.id)
      }

      return nextQuotes
    })
  }, [focusQuote])

  const deleteFocusedQuote = useCallback(() => {
    if (focusedQuoteId) {
      deleteQuote(focusedQuoteId)
    }
  }, [deleteQuote, focusedQuoteId])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        addQuote()
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'Backspace') {
        event.preventDefault()
        deleteFocusedQuote()
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        formRef.current?.requestSubmit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [addQuote, deleteFocusedQuote])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    quotes
      .map((quote) => quote.value)
      .filter((quote) => quote.trim())
      .forEach((quote) => {
        createWallpaper(
          quote,
          selectedResolution,
          backgroundColor,
          textColor,
          getQuoteFilename(quote)
        )
      })

    setQuotes([createQuoteInput()])
  }

  return (
    <main className="flex flex-col items-center h-screen py-16 gap-8">
      <h1 className="text-4xl font-bold">Quote Wallpaper Generator</h1>
      <form ref={formRef} className="w-full max-w-md" onSubmit={handleSubmit}>
        <Card className="w-full">
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
                        ref={(element) => {
                          quoteTextareaRefs.current[quote.id] = element
                        }}
                        value={quote.value}
                        onChange={(event) => updateQuote(quote.id, event.target.value)}
                        onFocus={() => setFocusedQuoteId(quote.id)}
                        onBlur={() => setFocusedQuoteId(null)}
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-keyshortcuts="Control+Enter Meta+Enter"
                    title="Add quote (Ctrl+Enter or Cmd+Enter). Delete focused quote with Ctrl+Backspace or Cmd+Backspace."
                    onClick={addQuote}
                  >
                    <Plus />
                    Add quote
                  </Button>
                </div>
              </FieldSet>
              <Separator />
              <FieldSet className="flex flex-row gap-8">
                <Field>
                  <FieldLabel>Background Color</FieldLabel>
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(event) => setBackgroundColor(event.target.value)}
                  />
                  <FieldDescription className="uppercase">{backgroundColor}</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel>Text Color</FieldLabel>
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(event) => setTextColor(event.target.value)}
                  />
                  <FieldDescription className="uppercase">{textColor}</FieldDescription>
                </Field>
              </FieldSet>
              <Separator />
              <FieldSet>
                <Field>
                  <FieldLabel>Resolution</FieldLabel>
                  <Select
                    value={selectedResolution.value}
                    onValueChange={(value) => {
                      const nextResolution = resolutions.find(
                        (resolution) => resolution.value === value
                      )

                      if (nextResolution) {
                        setSelectedResolution(nextResolution)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select resolution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {resolutions.map((resolution) => (
                          <SelectItem key={resolution.value} value={resolution.value}>
                            {resolution.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldSet>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              aria-keyshortcuts="Control+S Meta+S"
              title="Create wallpapers (Ctrl+S or Cmd+S)"
              disabled={!quotes.some((quote) => quote.value.trim())}
            >
              Create Wallpapers
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  )
}

export default App
