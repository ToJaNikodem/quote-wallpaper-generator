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

function App() {
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
            <FieldSet>
              <Field>
                <FieldLabel>Quote</FieldLabel>
                <Textarea placeholder="Enter your quote here" />
              </Field>
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
