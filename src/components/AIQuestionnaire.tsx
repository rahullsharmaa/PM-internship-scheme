import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuestionnaireProps {
  onComplete: (answers: QuestionnaireAnswers) => void;
  onClose: () => void;
}

export interface QuestionnaireAnswers {
  careerGoals: string;
  workEnvironment: string;
  learningStyle: string;
  timeCommitment: string;
  skillDevelopment: string;
  industryInterest: string;
  workMode: string;
  challenges: string;
  motivation: string;
  additionalInfo: string;
}

const questions = [
  {
    id: 'careerGoals',
    title: 'What are your primary career goals?',
    type: 'radio',
    options: [
      'Gain hands-on experience in my field of study',
      'Explore different career paths and industries',
      'Build professional network and connections',
      'Develop specific technical skills',
      'Prepare for full-time employment after graduation'
    ]
  },
  {
    id: 'workEnvironment',
    title: 'What type of work environment do you thrive in?',
    type: 'radio',
    options: [
      'Fast-paced startup environment with lots of variety',
      'Structured corporate environment with clear processes',
      'Creative and collaborative team settings',
      'Independent work with minimal supervision',
      'Research-focused or academic environment'
    ]
  },
  {
    id: 'learningStyle',
    title: 'How do you prefer to learn new skills?',
    type: 'radio',
    options: [
      'Hands-on practice and real projects',
      'Mentorship and guidance from experienced professionals',
      'Structured training programs and workshops',
      'Self-directed learning and research',
      'Collaborative learning with peers'
    ]
  },
  {
    id: 'timeCommitment',
    title: 'What is your preferred internship duration?',
    type: 'radio',
    options: [
      '1-2 months (Summer break)',
      '3-4 months (Semester break)',
      '6 months (Gap semester)',
      '12 months (Gap year)',
      'Part-time alongside studies'
    ]
  },
  {
    id: 'skillDevelopment',
    title: 'Which skills are you most eager to develop?',
    type: 'radio',
    options: [
      'Technical skills (programming, data analysis, design)',
      'Business skills (strategy, marketing, operations)',
      'Communication and presentation skills',
      'Leadership and project management',
      'Industry-specific knowledge and expertise'
    ]
  },
  {
    id: 'industryInterest',
    title: 'Which industry excites you the most?',
    type: 'radio',
    options: [
      'Technology and Software',
      'Finance and Banking',
      'Healthcare and Pharmaceuticals',
      'Education and EdTech',
      'Marketing and Media',
      'Consulting and Strategy',
      'Government and Public Service'
    ]
  },
  {
    id: 'workMode',
    title: 'What is your preferred work arrangement?',
    type: 'radio',
    options: [
      'Fully remote work',
      'Hybrid (mix of remote and office)',
      'Fully in-office',
      'Flexible based on project needs',
      'No strong preference'
    ]
  },
  {
    id: 'challenges',
    title: 'What type of challenges motivate you?',
    type: 'radio',
    options: [
      'Solving complex technical problems',
      'Working with diverse teams and stakeholders',
      'Creating innovative solutions from scratch',
      'Improving existing processes and systems',
      'Analyzing data to drive business decisions'
    ]
  },
  {
    id: 'motivation',
    title: 'What motivates you most in a work environment?',
    type: 'radio',
    options: [
      'Making a meaningful impact on society',
      'Learning from industry experts and mentors',
      'Building products that people use and love',
      'Achieving measurable results and goals',
      'Being part of a mission-driven organization'
    ]
  },
  {
    id: 'additionalInfo',
    title: 'Is there anything specific you want to achieve or learn during your internship?',
    type: 'textarea',
    placeholder: 'Share any specific goals, interests, or requirements you have for your ideal internship...'
  }
];

export function AIQuestionnaire({ onComplete, onClose }: QuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onComplete(answers as QuestionnaireAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = answers[currentQ.id as keyof QuestionnaireAnswers];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              AI Career Guidance
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{currentQ.title}</h3>
            
            {currentQ.type === 'radio' && (
              <RadioGroup
                value={answers[currentQ.id as keyof QuestionnaireAnswers] || ''}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
                className="space-y-3"
              >
                {currentQ.options?.map((option, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value={option} id={`${currentQ.id}-${index}`} className="mt-0.5" />
                    <Label 
                      htmlFor={`${currentQ.id}-${index}`} 
                      className="text-sm leading-relaxed cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQ.type === 'textarea' && (
              <Textarea
                placeholder={currentQ.placeholder}
                value={answers[currentQ.id as keyof QuestionnaireAnswers] || ''}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                className="min-h-[120px] resize-none"
              />
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              variant={currentQuestion === questions.length - 1 ? "hero" : "default"}
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Recommendations
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}