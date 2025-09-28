import { QuestionnaireAnswers } from '@/components/AIQuestionnaire';

const GEMINI_API_KEY = 'AIzaSyAJEZhSbomb0LqAfe4Q1hHm3ig46CrSMMM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

export interface InternshipRecommendation {
  title: string;
  organization: string;
  matchScore: number;
  reasoning: string;
  keyBenefits: string[];
  skillsToGain: string[];
  careerAlignment: string;
}

export async function getAIRecommendations(
  answers: QuestionnaireAnswers,
  availableInternships: any[]
): Promise<InternshipRecommendation[]> {
  try {
    const prompt = `
As a professional career counselor and AI assistant, analyze the following student profile and available internships to provide personalized recommendations.

STUDENT PROFILE:
- Career Goals: ${answers.careerGoals}
- Preferred Work Environment: ${answers.workEnvironment}
- Learning Style: ${answers.learningStyle}
- Time Commitment: ${answers.timeCommitment}
- Skill Development Focus: ${answers.skillDevelopment}
- Industry Interest: ${answers.industryInterest}
- Work Mode Preference: ${answers.workMode}
- Motivating Challenges: ${answers.challenges}
- Primary Motivation: ${answers.motivation}
- Additional Requirements: ${answers.additionalInfo || 'None specified'}

AVAILABLE INTERNSHIPS:
${availableInternships.slice(0, 20).map((internship, index) => `
${index + 1}. Title: ${internship.title || 'Not specified'}
   Organization: ${internship.organization || 'Not specified'}
   Location: ${internship.location || 'Not specified'}
   Duration: ${internship.duration || 'Not specified'}
   Sector: ${internship.sector || 'Not specified'}
   Skills: ${internship.skills || 'Not specified'}
   Stipend: ${internship.stipend || 'Not specified'}
   Perks: ${internship.perks || 'Not specified'}
`).join('\n')}

TASK:
Analyze the student's profile and recommend the TOP 5 most suitable internships. For each recommendation, provide:

1. Match Score (0-100): How well the internship aligns with the student's profile
2. Detailed Reasoning: Why this internship is a good fit (2-3 sentences)
3. Key Benefits: 3-4 specific benefits this internship offers
4. Skills to Gain: 3-4 key skills the student will develop
5. Career Alignment: How this internship supports their career goals

Format your response as a JSON array with this structure:
[
  {
    "title": "internship title",
    "organization": "organization name",
    "matchScore": 85,
    "reasoning": "This internship aligns perfectly with your goals because...",
    "keyBenefits": ["benefit 1", "benefit 2", "benefit 3"],
    "skillsToGain": ["skill 1", "skill 2", "skill 3"],
    "careerAlignment": "How this supports your career path..."
  }
]

Ensure recommendations are professional, specific, and genuinely helpful for the student's career development.
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const recommendations = JSON.parse(jsonMatch[0]);
    return recommendations;

  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    
    // Fallback recommendations if AI fails
    return availableInternships.slice(0, 5).map((internship, index) => ({
      title: internship.title || 'Internship Opportunity',
      organization: internship.organization || 'Company',
      matchScore: 75 - (index * 5),
      reasoning: 'This internship offers valuable experience in your field of interest and aligns with your career goals.',
      keyBenefits: [
        'Hands-on experience',
        'Professional networking',
        'Skill development',
        'Industry exposure'
      ],
      skillsToGain: [
        'Technical skills',
        'Communication',
        'Problem-solving',
        'Teamwork'
      ],
      careerAlignment: 'This opportunity will help you build the foundation for your career in this industry.'
    }));
  }
}