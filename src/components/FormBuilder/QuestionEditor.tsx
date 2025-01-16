'use client'

import { FormQuestion } from '@/types/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface QuestionEditorProps {
  question: FormQuestion
  onChange: (updates: Partial<FormQuestion>) => void
  onDelete: () => void
  onDuplicate: () => void
}

export default function QuestionEditor({
  question,
  onChange,
  onDelete,
  onDuplicate,
}: QuestionEditorProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Edit Question
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure your question settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onDuplicate}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logic">Logic</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <TabsContent value="content" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Question Text</Label>
                <Input
                  value={question.title}
                  onChange={(e) => onChange({ title: e.target.value })}
                  placeholder="Enter your question"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  value={question.description}
                  onChange={(e) => onChange({ description: e.target.value })}
                  placeholder="Add a description"
                />
              </div>
              {(question.type === 'multiple_choice' || question.type === 'dropdown') && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {question.options?.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])]
                          newOptions[index] = e.target.value
                          onChange({ options: newOptions })
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newOptions = [...(question.options || []), '']
                        onChange({ options: newOptions })
                      }}
                    >
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Required</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this question mandatory
                  </p>
                </div>
                <Switch
                  checked={question.required}
                  onCheckedChange={(checked) => onChange({ required: checked })}
                />
              </div>
              {question.type === 'multiple_choice' && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Multiple Selection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow selecting multiple options
                      </p>
                    </div>
                    <Switch
                      checked={question.settings?.multiple}
                      onCheckedChange={(checked) =>
                        onChange({
                          settings: { ...question.settings, multiple: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Randomize Options</Label>
                      <p className="text-sm text-muted-foreground">
                        Show options in random order
                      </p>
                    </div>
                    <Switch
                      checked={question.settings?.randomize}
                      onCheckedChange={(checked) =>
                        onChange({
                          settings: { ...question.settings, randomize: checked },
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="logic" className="space-y-6">
            <div className="text-center py-8 text-sm text-muted-foreground">
              Logic features coming soon
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
