import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Target, TrendingUp, Award, ExternalLink } from 'lucide-react';
import { InternshipRecommendation } from '@/services/geminiService';

interface AIRecommendationsProps {
  recommendations: InternshipRecommendation[];
  onClose: () => void;
}

export function AIRecommendations({ recommendations, onClose }: AIRecommendationsProps) {
  const handleApplyNow = () => {
    window.open("https://www.pminternship.gov.in/", "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI-Powered Recommendations</h2>
        </div>
        <Button variant="outline" onClick={onClose}>
          View All Internships
        </Button>
      </div>

      <div className="grid gap-6">
        {recommendations.map((rec, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl text-foreground">
                    {rec.title}
                  </CardTitle>
                  <p className="text-muted-foreground font-medium">
                    {rec.organization}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Match Score</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={rec.matchScore} className="w-20 h-2" />
                    <Badge variant="default" className="bg-primary">
                      {rec.matchScore}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Reasoning */}
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Why This is Perfect for You
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {rec.reasoning}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Key Benefits */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-accent" />
                    Key Benefits
                  </h4>
                  <ul className="space-y-2">
                    {rec.keyBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills to Gain */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                    Skills You'll Develop
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.skillsToGain.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Career Alignment */}
              <div className="bg-accent/5 p-4 rounded-lg">
                <h4 className="font-semibold text-accent mb-2">
                  Career Alignment
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {rec.careerAlignment}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleApplyNow}
                  className="w-full"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apply on PM Internship Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}