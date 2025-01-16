'use client'

import { FormQuestion } from '.'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Image, Link } from 'lucide-react'

interface QuestionSettingsProps {
  question: FormQuestion
  onChange: (updates: Partial<FormQuestion>) => void
}

export default function QuestionSettings({
  question,
  onChange,
}: QuestionSettingsProps) {
  const updateSettings = (updates: Partial<typeof question.settings>) => {
    onChange({
      settings: {
        ...question.settings,
        ...updates,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Basic Settings</Label>
          {question.type !== 'welcome_screen' &&
            question.type !== 'end_screen' &&
            question.type !== 'statement' && (
              <div className="flex items-center justify-between">
                <Label htmlFor="required">Required</Label>
                <Switch
                  id="required"
                  checked={question.required}
                  onCheckedChange={(checked) => onChange({ required: checked })}
                />
              </div>
            )}
        </div>
      </div>

      <Separator />

      {/* Question Type Specific Settings */}
      {(question.type === 'multiple_choice' ||
        question.type === 'dropdown' ||
        question.type === 'picture_choice') && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Choice Settings</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="multiple">Multiple selection</Label>
                <Switch
                  id="multiple"
                  checked={question.settings?.multiple}
                  onCheckedChange={(checked) =>
                    updateSettings({ multiple: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="randomize">Randomize options</Label>
                <Switch
                  id="randomize"
                  checked={question.settings?.randomize}
                  onCheckedChange={(checked) =>
                    updateSettings({ randomize: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="other">Allow "Other" option</Label>
                <Switch
                  id="other"
                  checked={question.settings?.allowOther}
                  onCheckedChange={(checked) =>
                    updateSettings({ allowOther: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="vertical">Vertical alignment</Label>
                <Switch
                  id="vertical"
                  checked={question.settings?.verticalAlign}
                  onCheckedChange={(checked) =>
                    updateSettings({ verticalAlign: checked })
                  }
                />
              </div>
            </div>
          </div>

          {question.type === 'picture_choice' && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Images</Label>
                <div className="grid grid-cols-2 gap-2">
                  {question.options?.map((_, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-20"
                      onClick={() => {
                        // TODO: Add image upload functionality
                      }}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {(question.type === 'welcome_screen' || question.type === 'end_screen') && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Screen Settings</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={question.settings?.buttonText || ''}
                  onChange={(e) =>
                    updateSettings({ buttonText: e.target.value })
                  }
                  placeholder={
                    question.type === 'welcome_screen'
                      ? 'Start'
                      : 'Submit'
                  }
                />
              </div>

              {question.type === 'end_screen' && (
                <div className="space-y-2">
                  <Label>Redirect URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={question.settings?.redirectUrl || ''}
                      onChange={(e) =>
                        updateSettings({ redirectUrl: e.target.value })
                      }
                      placeholder="https://..."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // TODO: Add URL validation
                      }}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Background Image</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // TODO: Add image upload functionality
                  }}
                >
                  <Image className="h-4 w-4 mr-2" />
                  {question.settings?.imageUrl
                    ? 'Change Image'
                    : 'Add Image'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
