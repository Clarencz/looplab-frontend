'use client'

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  FileCode,
  Folder,
  FolderTree,
  Sparkles,
  Clock,
  Loader2,
} from 'lucide-react'
import { useSmartNavigation } from '@/hooks/useSmartNavigation'
import Navbar from '@/components/Navbar'

// Types
type Category = 'Programming' | 'Algorithms' | 'DataScience' | 'Math' | 'Finance'
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery'
type GenerationStage = 'idle' | 'analyzing' | 'generating' | 'validating' | 'success'

interface FormData {
  category: Category | ''
  scenario: string
  industry: string
  difficulty: Difficulty | ''
  language: string
  description: string
  successCriteria: string
  codeSnippet: string
  injectAmbiguity: boolean
  hideErrorMessages: boolean
  includeRedHerrings: boolean
}

interface PreviewData {
  projectName: string
  description: string
  difficulty: Difficulty | ''
  fileStructure: string[]
  estimatedTime: string
}

// Scenario options based on category
const scenariosByCategory: Record<Category, string[]> = {
  Programming: [
    'Build REST API',
    'Implement Authentication',
    'Database Optimization',
    'Async Processing',
    'Microservices Design',
  ],
  Algorithms: [
    'Sorting Challenge',
    'Graph Traversal',
    'Dynamic Programming',
    'Binary Search Trees',
    'Pathfinding',
  ],
  DataScience: [
    'Predictive Modeling',
    'Data Cleaning',
    'Feature Engineering',
    'Time Series Analysis',
    'Classification Task',
  ],
  Math: [
    'Linear Algebra Problem',
    'Calculus Challenge',
    'Statistics Analysis',
    'Optimization Problem',
    'Probability Puzzle',
  ],
  Finance: [
    'Portfolio Optimization',
    'Risk Assessment',
    'Pricing Model',
    'Trading Strategy',
    'Financial Forecast',
  ],
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Manufacturing',
  'Entertainment',
  'Energy',
]

const programmingLanguages = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'Ruby',
]

const difficultyColors: Record<Difficulty, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  Advanced: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Mastery: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
}

export default function CreateCustomScenarioPage() {
  const navigate = useNavigate()
  const { getBackUrl, getBackLabel, buildNavUrl } = useSmartNavigation()

  const [formData, setFormData] = React.useState<FormData>({
    category: '',
    scenario: '',
    industry: '',
    difficulty: '',
    language: '',
    description: '',
    successCriteria: '',
    codeSnippet: '',
    injectAmbiguity: false,
    hideErrorMessages: false,
    includeRedHerrings: false,
  })

  const [previewData, setPreviewData] = React.useState<PreviewData>({
    projectName: '',
    description: '',
    difficulty: '',
    fileStructure: [],
    estimatedTime: '',
  })

  const [generationStage, setGenerationStage] = React.useState<GenerationStage>('idle')
  const [generationProgress, setGenerationProgress] = React.useState(0)
  const [charCount, setCharCount] = React.useState({ description: 0, successCriteria: 0, codeSnippet: 0 })
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({})

  // Available scenarios based on selected category
  const availableScenarios = formData.category
    ? scenariosByCategory[formData.category as Category]
    : []

  // Debounced preview update
  React.useEffect(() => {
    const timer = setTimeout(() => {
      updatePreview()
    }, 300)

    return () => clearTimeout(timer)
  }, [formData.category, formData.scenario, formData.difficulty, formData.description])

  const updatePreview = () => {
    if (!formData.category || !formData.scenario) {
      setPreviewData({
        projectName: '',
        description: '',
        difficulty: '',
        fileStructure: [],
        estimatedTime: '',
      })
      return
    }

    // Generate project name
    const projectName = `${formData.category}_${formData.scenario.replace(/\s+/g, '_')}_Challenge`

    // Generate file structure based on category
    let fileStructure: string[] = []
    if (formData.category === 'Programming') {
      fileStructure = [
        `src/main.${formData.language === 'Python' ? 'py' : formData.language === 'Java' ? 'java' : 'ts'}`,
        'tests/test_solution.test.ts',
        'README.md',
        'package.json',
      ]
    } else if (formData.category === 'DataScience') {
      fileStructure = [
        'notebooks/analysis.ipynb',
        'data/dataset.csv',
        'src/preprocessing.py',
        'requirements.txt',
      ]
    } else {
      fileStructure = [
        'src/solution.ts',
        'tests/solution.test.ts',
        'README.md',
      ]
    }

    // Estimate time based on difficulty
    const timeEstimates: Record<Difficulty, string> = {
      Beginner: '30-45 minutes',
      Intermediate: '1-2 hours',
      Advanced: '2-4 hours',
      Mastery: '4-6 hours',
    }

    setPreviewData({
      projectName,
      description: formData.description || 'Complete the challenge by following the requirements...',
      difficulty: formData.difficulty,
      fileStructure,
      estimatedTime: formData.difficulty ? timeEstimates[formData.difficulty as Difficulty] : 'N/A',
    })
  }

  const updateFormField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Reset scenario when category changes
    if (field === 'category') {
      setFormData((prev) => ({ ...prev, scenario: '' }))
    }

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.category) errors.category = 'Category is required'
    if (!formData.scenario) errors.scenario = 'Scenario is required'
    if (!formData.difficulty) errors.difficulty = 'Difficulty is required'
    if (formData.description.length < 50) {
      errors.description = `Description must be at least 50 characters (${formData.description.length}/50)`
    }
    if (formData.description.length > 5000) {
      errors.description = 'Description must not exceed 5000 characters'
    }
    if (formData.category === 'Programming' && !formData.language) {
      errors.language = 'Language is required for Programming category'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleGenerate = async () => {
    if (!validateForm()) return

    setGenerationStage('analyzing')
    setGenerationProgress(0)

    // Simulate generation stages
    const stages: GenerationStage[] = ['analyzing', 'generating', 'validating', 'success']
    let currentStageIndex = 0

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setGenerationStage('success')
          return 100
        }

        // Move to next stage
        if (newProgress > (currentStageIndex + 1) * 25 && currentStageIndex < stages.length - 2) {
          currentStageIndex++
          setGenerationStage(stages[currentStageIndex])
        }

        return newProgress
      })
    }, 400)
  }

  const handleStartWorking = () => {
    console.log('[Create Scenario] Starting project with data:', { formData, previewData })
    // TODO: In the future, this would create a project via API and navigate to workspace
    // For now, navigate to projects page with context preserved
    navigate(buildNavUrl('/projects'))
  }

  const getStageLabel = (stage: GenerationStage): string => {
    const labels: Record<GenerationStage, string> = {
      idle: '',
      analyzing: 'Analyzing requirements...',
      generating: 'Generating project structure...',
      validating: 'Validating scenario...',
      success: 'Scenario created successfully!',
    }
    return labels[stage]
  }

  const isGenerating = generationStage !== 'idle' && generationStage !== 'success'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 pt-24 pb-8">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => navigate(getBackUrl('/dashboard'))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {getBackLabel('Back to Dashboard')}
        </Button>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Create Custom Scenario</h1>
              <p className="text-sm text-muted-foreground">Design your own learning challenge</p>
            </div>
          </div>
        </div>
      </header>

      {/* Two-Panel Layout */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel - Form (40%) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Scenario Configuration</h2>
                <p className="text-sm text-muted-foreground">Configure the parameters for your custom challenge</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateFormField('category', value as Category)}
                >
                  <SelectTrigger id="category" className="w-full" aria-invalid={!!validationErrors.category}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Algorithms">Algorithms</SelectItem>
                    <SelectItem value="DataScience">Data Science</SelectItem>
                    <SelectItem value="Math">Math</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.category && (
                  <p className="text-xs text-destructive">{validationErrors.category}</p>
                )}
              </div>

              {/* Scenario */}
              <div className="space-y-2">
                <Label htmlFor="scenario">
                  Scenario Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.scenario}
                  onValueChange={(value) => updateFormField('scenario', value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger id="scenario" className="w-full" aria-invalid={!!validationErrors.scenario}>
                    <SelectValue placeholder={formData.category ? 'Select scenario' : 'Select category first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableScenarios.map((scenario) => (
                      <SelectItem key={scenario} value={scenario}>
                        {scenario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.scenario && (
                  <p className="text-xs text-destructive">{validationErrors.scenario}</p>
                )}
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">
                  Difficulty Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => updateFormField('difficulty', value as Difficulty)}
                >
                  <SelectTrigger id="difficulty" className="w-full" aria-invalid={!!validationErrors.difficulty}>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Mastery">Mastery</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.difficulty && (
                  <p className="text-xs text-destructive">{validationErrors.difficulty}</p>
                )}
              </div>

              {/* Language (conditional) */}
              {formData.category === 'Programming' && (
                <div className="space-y-2">
                  <Label htmlFor="language">
                    Programming Language <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => updateFormField('language', value)}
                  >
                    <SelectTrigger id="language" className="w-full" aria-invalid={!!validationErrors.language}>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {programmingLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.language && (
                    <p className="text-xs text-destructive">{validationErrors.language}</p>
                  )}
                </div>
              )}

              {/* Industry (optional) */}
              <div className="space-y-2">
                <Label htmlFor="industry">Industry Context (Optional)</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => updateFormField('industry', value)}
                >
                  <SelectTrigger id="industry" className="w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">
                    Problem Description <span className="text-destructive">*</span>
                  </Label>
                  <span
                    className={`text-xs ${charCount.description < 50 || charCount.description > 5000
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                      }`}
                  >
                    {charCount.description}/5000 (min: 50)
                  </span>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe the problem your learners will solve..."
                  value={formData.description}
                  onChange={(e) => {
                    updateFormField('description', e.target.value)
                    setCharCount((prev) => ({ ...prev, description: e.target.value.length }))
                  }}
                  className="min-h-32"
                  aria-invalid={!!validationErrors.description}
                />
                {validationErrors.description && (
                  <p className="text-xs text-destructive">{validationErrors.description}</p>
                )}
              </div>

              {/* Success Criteria */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="successCriteria">Success Criteria (Optional)</Label>
                  <span className="text-xs text-muted-foreground">{charCount.successCriteria}/500</span>
                </div>
                <Textarea
                  id="successCriteria"
                  placeholder="Define what success looks like..."
                  value={formData.successCriteria}
                  onChange={(e) => {
                    updateFormField('successCriteria', e.target.value.slice(0, 500))
                    setCharCount((prev) => ({ ...prev, successCriteria: e.target.value.length }))
                  }}
                  className="min-h-24"
                />
              </div>

              {/* Code Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="codeSnippet">Starter Code (Optional)</Label>
                  <span className="text-xs text-muted-foreground">{charCount.codeSnippet}/2000</span>
                </div>
                <Textarea
                  id="codeSnippet"
                  placeholder="// Provide starter code or templates..."
                  value={formData.codeSnippet}
                  onChange={(e) => {
                    updateFormField('codeSnippet', e.target.value.slice(0, 2000))
                    setCharCount((prev) => ({ ...prev, codeSnippet: e.target.value.length }))
                  }}
                  className="min-h-32 font-mono text-sm"
                />
              </div>

              {/* AI Options */}
              <div className="space-y-3 pt-2">
                <Label>AI Enhancement Options</Label>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="injectAmbiguity"
                      checked={formData.injectAmbiguity}
                      onCheckedChange={(checked) =>
                        updateFormField('injectAmbiguity', checked as boolean)
                      }
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="injectAmbiguity" className="cursor-pointer font-normal">
                        Inject Ambiguity
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Add intentional vagueness to test problem-solving skills
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="hideErrorMessages"
                      checked={formData.hideErrorMessages}
                      onCheckedChange={(checked) =>
                        updateFormField('hideErrorMessages', checked as boolean)
                      }
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="hideErrorMessages" className="cursor-pointer font-normal">
                        Hide Error Messages
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Make learners debug without explicit error hints
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="includeRedHerrings"
                      checked={formData.includeRedHerrings}
                      onCheckedChange={(checked) =>
                        updateFormField('includeRedHerrings', checked as boolean)
                      }
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="includeRedHerrings" className="cursor-pointer font-normal">
                        Include Red Herrings
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Add misleading information to increase difficulty
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles />
                      Generate Scenario
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview (60%) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Live Preview</h2>
                {previewData.projectName && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {previewData.projectName}
                  </Badge>
                )}
              </div>

              {generationStage === 'success' ? (
                // Success State
                <div className="space-y-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-12" />
                      <div>
                        <h3 className="text-xl font-semibold">Scenario Created!</h3>
                        <p className="text-sm text-muted-foreground">Your custom challenge is ready to use</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <h4 className="font-semibold text-foreground">{previewData.projectName}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {previewData.description}
                          </p>
                        </div>
                        {previewData.difficulty && (
                          <Badge
                            variant="outline"
                            className={difficultyColors[previewData.difficulty as Difficulty]}
                          >
                            {previewData.difficulty}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-4" />
                          <span>{previewData.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileCode className="size-4" />
                          <span>{previewData.fileStructure.length} files</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FolderTree className="size-4" />
                        Project Structure
                      </h5>
                      <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm space-y-1.5">
                        {previewData.fileStructure.map((file, index) => {
                          const isFolder = !file.includes('.')
                          return (
                            <div key={index} className="flex items-center gap-2 text-muted-foreground">
                              {isFolder ? (
                                <Folder className="size-4 text-amber-500" />
                              ) : (
                                <Code2 className="size-4 text-blue-500" />
                              )}
                              <span>{file}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleStartWorking} size="lg" className="w-full">
                    <Code2 />
                    Start Working
                  </Button>
                </div>
              ) : isGenerating ? (
                // Generating State
                <div className="space-y-8 py-12">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <Loader2 className="size-16 text-primary animate-spin" />
                        <Sparkles className="size-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {getStageLabel(generationStage)}
                      </h3>
                      <p className="text-sm text-muted-foreground">This may take a few moments</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      {Math.round(generationProgress)}% complete
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${generationStage === 'analyzing'
                            ? 'bg-primary animate-pulse'
                            : 'bg-muted-foreground'
                          }`}
                      />
                      <span>Analyzing requirements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${generationStage === 'generating'
                            ? 'bg-primary animate-pulse'
                            : generationProgress > 25
                              ? 'bg-primary'
                              : 'bg-muted-foreground'
                          }`}
                      />
                      <span>Generating project structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${generationStage === 'validating'
                            ? 'bg-primary animate-pulse'
                            : generationProgress > 75
                              ? 'bg-primary'
                              : 'bg-muted-foreground'
                          }`}
                      />
                      <span>Validating scenario</span>
                    </div>
                  </div>
                </div>
              ) : previewData.projectName ? (
                // Preview State
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-semibold text-foreground">{previewData.projectName}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {previewData.description}
                        </p>
                      </div>
                      {previewData.difficulty && (
                        <Badge
                          variant="outline"
                          className={difficultyColors[previewData.difficulty as Difficulty]}
                        >
                          {previewData.difficulty}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        <span>{previewData.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileCode className="size-4" />
                        <span>{previewData.fileStructure.length} files</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <FolderTree className="size-4" />
                      Project Structure
                    </h5>
                    <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm space-y-1.5">
                      {previewData.fileStructure.map((file, index) => {
                        const isFolder = !file.includes('.')
                        return (
                          <div key={index} className="flex items-center gap-2 text-muted-foreground">
                            {isFolder ? (
                              <Folder className="size-4 text-amber-500" />
                            ) : (
                              <Code2 className="size-4 text-blue-500" />
                            )}
                            <span>{file}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Fill out all required fields and click "Generate Scenario" to create your custom challenge.
                    </p>
                  </div>
                </div>
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="flex items-center justify-center size-16 rounded-full bg-muted/50 text-muted-foreground">
                    <Sparkles className="size-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">No Preview Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                      Start configuring your scenario on the left to see a live preview here. Select a category
                      and scenario type to begin.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
