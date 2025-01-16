'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Plus } from 'lucide-react'
import { QuestionType } from '@/types/form'

const questionTypes = [
  {
    category: 'Popular',
    items: [
      { type: 'multiple_choice' as QuestionType, label: 'Multiple Choice', description: 'Let people choose from multiple options' },
      { type: 'text' as QuestionType, label: 'Short Text', description: 'Collect brief text responses' },
      { type: 'long_text' as QuestionType, label: 'Long Text', description: 'Collect longer text responses' },
      { type: 'email' as QuestionType, label: 'Email', description: 'Collect email addresses' },
    ],
  },
  {
    category: 'Choice',
    items: [
      { type: 'dropdown' as QuestionType, label: 'Dropdown', description: 'Show choices in a compact menu' },
      { type: 'yes_no' as QuestionType, label: 'Yes/No', description: 'Simple binary choice' },
      { type: 'picture_choice' as QuestionType, label: 'Picture Choice', description: 'Let people choose between images' },
      { type: 'ranking' as QuestionType, label: 'Ranking', description: 'Let people order options' },
    ],
  },
  {
    category: 'Contact',
    items: [
      { type: 'phone' as QuestionType, label: 'Phone Number', description: 'Collect phone numbers' },
      { type: 'website' as QuestionType, label: 'Website', description: 'Collect website URLs' },
    ],
  },
  {
    category: 'Date & Time',
    items: [
      { type: 'date' as QuestionType, label: 'Date', description: 'Ask for a date' },
      { type: 'time' as QuestionType, label: 'Time', description: 'Ask for a time' },
    ],
  },
  {
    category: 'Layout',
    items: [
      { type: 'welcome_screen' as QuestionType, label: 'Welcome Screen', description: 'Add an introduction' },
      { type: 'end_screen' as QuestionType, label: 'End Screen', description: 'Add a thank you message' },
      { type: 'statement' as QuestionType, label: 'Statement', description: 'Show text without a question' },
    ],
  },
]

interface QuestionTypeMenuProps {
  onSelect: (type: QuestionType) => void
}

export default function QuestionTypeMenu({ onSelect }: QuestionTypeMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-4">
            {questionTypes.map((category) => (
              <div key={category.category}>
                <h4 className="font-medium mb-2">{category.category}</h4>
                <div className="space-y-1">
                  {category.items.map((item) => (
                    <Button
                      key={item.type}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => onSelect(item.type)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
